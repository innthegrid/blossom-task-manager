const assert = require('node:assert/strict');
const { execFile } = require('node:child_process');
const { randomUUID } = require('node:crypto');
const { once } = require('node:events');
const { after, before, test } = require('node:test');
const { promisify } = require('node:util');
const jwt = require('jsonwebtoken');

if (!process.env.TEST_DATABASE_URL) {
    throw new Error('Set TEST_DATABASE_URL to a migrated PostgreSQL test database.');
}

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
process.env.JWT_SECRET = randomUUID();

const app = require('../src/index');
const { prisma } = require('../src/config/database');

const emails = [];
let server;
let baseUrl;

before(async () => {
    await prisma.$connect();
    server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    baseUrl = `http://127.0.0.1:${server.address().port}/api`;
});

after(async () => {
    try {
        if (server) {
            await new Promise((resolve, reject) => {
                server.close((error) => error ? reject(error) : resolve());
            });
        }
        if (emails.length) await prisma.user.deleteMany({ where: { email: { in: emails } } });
    } finally {
        await prisma.$disconnect();
    }
});

async function request(path, { method = 'GET', token, body, status = 200 } = {}) {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    const response = await fetch(baseUrl + path, {
        method,
        headers,
        body: JSON.stringify(body),
    });
    const data = await response.json();
    assert.equal(response.status, status, `${method} ${path}: ${JSON.stringify(data)}`);
    return data;
}

async function register() {
    const email = `test-${randomUUID()}@example.com`;
    emails.push(email);
    return request('/auth/register', {
        method: 'POST',
        body: { email, password: 'BlossomTest1' },
        status: 201,
    });
}

async function createTask(token, body, status = 201) {
    const result = await request('/tasks', { method: 'POST', token, body, status });
    return result.task;
}

test('refresh replaces expired access and keeps the existing refresh token usable', async () => {
    const { user, tokens } = await register();
    const expiredAccess = jwt.sign(
        { userId: user.id, type: 'access' },
        process.env.JWT_SECRET,
        { expiresIn: -1 },
    );

    await request('/tasks', { token: expiredAccess, status: 401 });
    await request('/tasks', { token: tokens.refreshToken, status: 401 });
    await request('/auth/refresh', {
        method: 'POST',
        body: { refreshToken: tokens.accessToken },
        status: 401,
    });

    const refresh = () => request('/auth/refresh', {
        method: 'POST',
        body: { refreshToken: tokens.refreshToken },
    });

    const { accessToken } = await refresh();
    const profile = await request('/auth/profile', { token: accessToken });
    assert.equal(profile.user.id, user.id);
    assert.ok((await refresh()).accessToken);
});

test('accounts cannot read or modify each other’s tasks or assign each other’s categories', async () => {
    const { tokens: owner } = await register();
    const { tokens: other } = await register();
    const { category } = await request('/categories', {
        method: 'POST',
        token: owner.accessToken,
        body: { name: 'Work' },
        status: 201,
    });
    const task = await createTask(owner.accessToken, { title: 'Private task', categoryId: category.id });

    const { tasks } = await request('/tasks', { token: other.accessToken });
    assert.deepEqual(tasks, []);
    const path = `/tasks/${task.id}`;
    await request(path, { token: other.accessToken, status: 404 });
    await request(path, {
        method: 'PUT', token: other.accessToken, body: { title: 'Changed' }, status: 404,
    });
    await request(path, { method: 'DELETE', token: other.accessToken, status: 404 });
    await createTask(other.accessToken, { title: 'Wrong category', categoryId: category.id }, 404);

    const result = await request(path, { token: owner.accessToken });
    assert.equal(result.task.title, task.title);
});

test('task lifecycle preserves subtasks through completion, archive, and restore', async () => {
    const { tokens: { accessToken: token } } = await register();
    const task = await createTask(token, {
        title: 'Build demo',
        subtasks: [{ title: 'Draft walkthrough' }],
    });
    const path = `/tasks/${task.id}`;
    assert.equal(task.status, 'pending');
    assert.equal(task.completedAt, null);
    assert.equal(task.subtasks[0].completed, false);

    const completed = await request(`${path}/toggle`, {
        method: 'PATCH', token, body: { completed: true },
    });
    assert.equal(completed.task.status, 'completed');
    const completion = completed.task.completedAt;
    assert.ok(Number.isFinite(Date.parse(completion)));

    const edited = await request(path, {
        method: 'PUT', token, body: { title: 'Update demo', status: 'completed' },
    });
    assert.equal(edited.task.completedAt, completion);

    const archive = () => request('/tasks/archive/completed', { method: 'POST', token });
    assert.equal((await archive()).archivedCount, 1);
    assert.equal((await archive()).archivedCount, 0);

    const archived = await request('/tasks/archive/list', { token });
    assert.deepEqual(archived.tasks.map(({ id, status }) => ({ id, status })), [
        { id: task.id, status: 'archived' },
    ]);
    assert.equal(archived.tasks[0].completedAt, completion);

    const restored = await request(`${path}/restore`, { method: 'PATCH', token });
    assert.equal(restored.task.status, 'pending');
    assert.equal(restored.task.completedAt, null);
    assert.deepEqual(restored.task.subtasks, task.subtasks);
    assert.deepEqual((await request('/tasks/archive/list', { token })).tasks, []);

    const recompleted = await request(path, {
        method: 'PUT', token, body: { status: 'completed' },
    });
    assert.equal(recompleted.task.status, 'completed');
    assert.ok(Date.parse(recompleted.task.completedAt) > Date.parse(completion));

    const reopened = await request(`${path}/toggle`, {
        method: 'PATCH', token, body: { completed: false },
    });
    assert.equal(reopened.task.status, 'pending');
    assert.equal(reopened.task.completedAt, null);

    await request(path, { method: 'DELETE', token });
    await request(path, { token, status: 404 });
});

test('demo seeding preserves existing tasks and demo edits on repeat runs', async () => {
    const { tokens: { accessToken: ownerToken } } = await register();
    const existingTask = await createTask(ownerToken, { title: 'Keep this task' });
    const demoEmail = `demo-${randomUUID()}@example.com`;
    emails.push(demoEmail);
    const password = 'BlossomDemo42';

    function seed(demoPassword) {
        return promisify(execFile)(process.execPath, [require.resolve('../src/scripts/seed')], {
            env: { ...process.env, DEMO_EMAIL: demoEmail, DEMO_PASSWORD: demoPassword },
        });
    }

    await seed(password);
    const { tokens: { accessToken: demoToken } } = await request('/auth/login', {
        method: 'POST',
        body: { email: demoEmail, password },
    });
    const { tasks } = await request('/tasks', { token: demoToken });
    assert.equal(tasks.length, 5);

    await request(`/tasks/${tasks[0].id}`, {
        method: 'PUT', token: demoToken, body: { title: 'Edited demo task' },
    });
    await seed('DifferentPass42');

    const demoAfter = await request('/tasks', { token: demoToken });
    assert.equal(demoAfter.tasks.length, tasks.length);
    assert.ok(demoAfter.tasks.some(({ title }) => title === 'Edited demo task'));
    const ownerAfter = await request(`/tasks/${existingTask.id}`, { token: ownerToken });
    assert.equal(ownerAfter.task.title, existingTask.title);
    await request('/auth/login', { method: 'POST', body: { email: demoEmail, password } });
});

test('concurrent completions of a weekly task create one dated successor with fresh subtasks', async () => {
    const { tokens: { accessToken: token } } = await register();
    const original = await createTask(token, {
        title: 'Water the plants',
        priority: 'high',
        tags: ['garden'],
        dueDate: '2026-12-28',
        recurring: 'weekly',
        subtasks: [{ title: 'Check the soil', completed: true }],
    });
    const path = `/tasks/${original.id}`;
    const completed = await Promise.all([
        request(path, { method: 'PUT', token, body: { status: 'completed' } }),
        request(`${path}/toggle`, { method: 'PATCH', token, body: { completed: true } }),
    ]);
    assert.ok(completed.every(({ task }) => task.status === 'completed' && task.completedAt));

    const { tasks } = await request('/tasks', { token });
    assert.equal(tasks.length, 2);
    const next = tasks.find(({ id }) => id !== original.id);
    assert.equal(next.status, 'pending');
    assert.equal(next.completedAt, null);
    assert.equal(next.dueDate, '2027-01-04T00:00:00.000Z');
    assert.equal(next.recurring, 'weekly');
    assert.equal(next.recurrenceSeriesId, original.recurrenceSeriesId);
    assert.equal(next.title, original.title);
    assert.equal(next.priority, original.priority);
    assert.deepEqual(next.tags, ['garden']);
    assert.deepEqual(next.subtasks.map(({ title, completed }) => ({ title, completed })), [
        { title: 'Check the soil', completed: false },
    ]);

    // Reopening and moving the original cannot create a second successor.
    await request(path, {
        method: 'PUT', token, body: { status: 'pending', dueDate: '2026-12-29' },
    });
    await request(path, { method: 'PUT', token, body: { status: 'completed' } });
    assert.equal((await request('/tasks', { token })).tasks.length, 2);
});

test('repeat rules validate dates, advance daily, and can be turned off', async () => {
    const { tokens: { accessToken: token } } = await register();
    await createTask(token, { title: 'No date', recurring: 'daily' }, 400);
    await createTask(token, { title: 'Impossible date', recurring: 'daily', dueDate: '2026-02-30' }, 400);
    await createTask(token, { title: 'Unsupported', recurring: 'monthly', dueDate: '2026-03-08' }, 400);

    const original = await createTask(token, { title: 'Morning checklist', dueDate: '2026-03-08' });
    const path = `/tasks/${original.id}`;
    await request(path, { method: 'PUT', token, body: { recurring: 'daily' } });
    await request(path, { method: 'PUT', token, body: { dueDate: null }, status: 400 });
    await request(path, {
        method: 'PUT', token,
        body: { status: 'completed', subtasks: [{ title: 'New checklist item', completed: true }] },
    });
    const { tasks } = await request('/tasks', { token });
    assert.equal(tasks.length, 2);
    const next = tasks.find(({ id }) => id !== original.id);
    assert.equal(next.dueDate, '2026-03-09T00:00:00.000Z');
    assert.equal(next.subtasks[0].title, 'New checklist item');
    assert.equal(next.subtasks[0].completed, false);

    const nextPath = `/tasks/${next.id}`;
    await request(nextPath, {
        method: 'PUT', token, body: { dueDate: original.dueDate }, status: 409,
    });
    await request(nextPath, {
        method: 'PUT', token, body: { recurring: null, dueDate: null },
    });
    await request(`${nextPath}/toggle`, { method: 'PATCH', token, body: { completed: true } });
    assert.equal((await request('/tasks', { token })).tasks.length, 2);
});
