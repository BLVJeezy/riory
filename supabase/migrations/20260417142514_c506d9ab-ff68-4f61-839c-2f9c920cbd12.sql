
-- Create pgmq queue for Simpla leads
SELECT pgmq.create('simpla_leads');
SELECT pgmq.create('simpla_leads_dlq');

-- Schedule cron to process queue every minute
SELECT cron.schedule(
  'process-simpla-queue',
  '* * * * *',
  $$
  SELECT net.http_post(
    url:='https://bqcxvvpawbwupornueww.supabase.co/functions/v1/process-simpla-queue',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxY3h2dnBhd2J3dXBvcm51ZXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTQyNTUsImV4cCI6MjA4ODY3MDI1NX0.4XUjKVlt6mk98sIpvR06Zo2m5gL5txCpa3EQIvWmWrc"}'::jsonb,
    body:='{}'::jsonb
  );
  $$
);
