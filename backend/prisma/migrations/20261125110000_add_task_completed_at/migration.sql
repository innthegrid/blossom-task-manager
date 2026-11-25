-- Existing completion times cannot be recovered from the last edit time.
ALTER TABLE "tasks" ADD COLUMN "completedAt" TIMESTAMP(3);

CREATE FUNCTION set_task_completed_at() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW."status" = 'completed' THEN
            NEW."completedAt" := statement_timestamp() AT TIME ZONE 'UTC';
        ELSE
            NEW."completedAt" := NULL;
        END IF;
    ELSIF NEW."status" = 'completed' AND OLD."status" <> 'completed' THEN
        NEW."completedAt" := statement_timestamp() AT TIME ZONE 'UTC';
    ELSIF NEW."status" IN ('completed', 'archived') THEN
        NEW."completedAt" := OLD."completedAt";
    ELSE
        NEW."completedAt" := NULL;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER tasks_set_completed_at
BEFORE INSERT OR UPDATE ON "tasks"
FOR EACH ROW EXECUTE FUNCTION set_task_completed_at();
