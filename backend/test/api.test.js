const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { once } = require('node:events');
const { after, before, test } = require('node:test');
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
    assert.equal(task.subtasks[0].completed, false);

    const completed = await request(`${path}/toggle`, {
        method: 'PATCH', token, body: { completed: true },
    });
    assert.equal(completed.task.status, 'completed');

    const archive = () => request('/tasks/archive/completed', { method: 'POST', token });
    assert.equal((await archive()).archivedCount, 1);
    assert.equal((await archive()).archivedCount, 0);

    const archived = await request('/tasks/archive/list', { token });
    assert.deepEqual(archived.tasks.map(({ id, status }) => ({ id, status })), [
        { id: task.id, status: 'archived' },
    ]);

    const restored = await request(`${path}/restore`, { method: 'PATCH', token });
    assert.equal(restored.task.status, 'pending');
    assert.deepEqual(restored.task.subtasks, task.subtasks);
    assert.deepEqual((await request('/tasks/archive/list', { token })).tasks, []);

    await request(path, { method: 'DELETE', token });
    await request(path, { token, status: 404 });
});
