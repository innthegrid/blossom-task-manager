const { randomUUID } = require('node:crypto');
const { prisma } = require('../config/database');

const taskRelations = { category: true, subtasks: true };
const repeatDays = new Map([['daily', 1], ['weekly', 7]]);

class TaskScheduleError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}

function parseDueDate(value) {
    if (value === null || value === '') return null;
    const date = new Date(value);
    if (!Number.isFinite(date.getTime()) ||
        (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
            date.toISOString().slice(0, 10) !== value)) {
        throw new TaskScheduleError('Enter a valid due date.');
    }
    return date;
}

function applyTaskSchedule(data, existing) {
    if (data.recurring === '') data.recurring = null;
    if (data.recurring !== undefined && data.recurring !== null && !repeatDays.has(data.recurring)) {
        throw new TaskScheduleError('Repeat must be daily, weekly, or never.');
    }

    const recurring = data.recurring === undefined ? existing?.recurring : data.recurring;
    if (!repeatDays.has(recurring)) return;

    const dueDate = data.dueDate === undefined ? existing?.dueDate : data.dueDate;
    if (!dueDate) throw new TaskScheduleError('Choose a due date for the repeating task.');

    data.dueDate = new Date(dueDate);
    data.dueDate.setUTCHours(0, 0, 0, 0);
    data.recurrenceSeriesId = existing?.recurrenceSeriesId ?? randomUUID();
}

async function createNextOccurrence(tx, task) {
    const nextDueDate = new Date(task.dueDate);
    nextDueDate.setUTCDate(nextDueDate.getUTCDate() + repeatDays.get(task.recurring));
    const id = randomUUID();
    const { count } = await tx.task.createMany({
        data: {
            id,
            dueDate: nextDueDate,
            title: task.title,
            description: task.description,
            priority: task.priority,
            categoryId: task.categoryId,
            userId: task.userId,
            tags: task.tags,
            flowerEmoji: task.flowerEmoji,
            isBlossom: task.isBlossom,
            recurring: task.recurring,
            recurrenceSeriesId: task.recurrenceSeriesId,
            previousOccurrenceId: task.id,
        },
        skipDuplicates: true,
    });

    if (count && task.subtasks.length) {
        await tx.subtask.createMany({
            data: task.subtasks.map(({ title }) => ({ title, taskId: id })),
        });
    }
}

async function updateTaskWithRecurrence(taskId, userId, data) {
    return prisma.$transaction(async (tx) => {
        // Serialize updates to the same occurrence before deciding whether it just completed.
        const [existing] = await tx.$queryRaw`
            SELECT "status", "recurring", "dueDate", "recurrenceSeriesId"
            FROM "tasks" WHERE "id" = ${taskId} AND "userId" = ${userId} FOR UPDATE
        `;
        if (!existing) throw new TaskScheduleError('Task not found', 404);

        applyTaskSchedule(data, existing);
        const task = await tx.task.update({
            where: { id: taskId },
            data,
            include: taskRelations,
        });
        if (existing.status !== 'completed' && task.status === 'completed' && repeatDays.has(task.recurring)) {
            await createNextOccurrence(tx, task);
        }
        return task;
    });
}

module.exports = { applyTaskSchedule, parseDueDate, TaskScheduleError, updateTaskWithRecurrence };
