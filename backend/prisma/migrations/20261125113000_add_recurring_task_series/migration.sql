ALTER TABLE "tasks"
ADD COLUMN "recurrenceSeriesId" TEXT,
ADD COLUMN "previousOccurrenceId" TEXT;

CREATE UNIQUE INDEX "tasks_recurrenceSeriesId_dueDate_key"
ON "tasks" ("recurrenceSeriesId", "dueDate");

CREATE UNIQUE INDEX "tasks_previousOccurrenceId_key"
ON "tasks" ("previousOccurrenceId");
