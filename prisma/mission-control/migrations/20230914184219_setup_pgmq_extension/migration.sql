-- This is an empty migration.
-- Insert PGMQ extension
CREATE EXTENSION IF NOT EXISTS pgmq CASCADE;

-- CREATE QUEUE TO ASSIGN TASKS (MC_Domain)
SELECT pgmq_create('assign_task_queue');
