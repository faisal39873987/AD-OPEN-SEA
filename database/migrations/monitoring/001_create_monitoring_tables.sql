-- Migration to create performance monitoring and feedback tables
-- Run this with: supabase db execute --file=./database/migrations/monitoring/001_create_monitoring_tables.sql

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS "monitoring";

-- Performance metrics table for Web Vitals and custom metrics
CREATE TABLE "monitoring"."performance_metrics" (
  "id" BIGSERIAL PRIMARY KEY,
  "metric_name" TEXT NOT NULL,
  "metric_value" DOUBLE PRECISION NOT NULL,
  "metric_delta" DOUBLE PRECISION,
  "metric_id" TEXT,
  "page_path" TEXT NOT NULL,
  "page_url" TEXT NOT NULL,
  "user_agent" TEXT,
  "ip_address" TEXT,
  "category" TEXT CHECK ("category" IN ('good', 'needs-improvement', 'poor')),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for efficient querying
CREATE INDEX "performance_metrics_metric_name_idx" ON "monitoring"."performance_metrics" ("metric_name");
CREATE INDEX "performance_metrics_page_path_idx" ON "monitoring"."performance_metrics" ("page_path");
CREATE INDEX "performance_metrics_created_at_idx" ON "monitoring"."performance_metrics" ("created_at");

-- User feedback table
CREATE TABLE "monitoring"."user_feedback" (
  "id" BIGSERIAL PRIMARY KEY,
  "feedback_type" TEXT NOT NULL CHECK ("feedback_type" IN ('performance', 'usability', 'design', 'feature', 'bug')),
  "rating" INTEGER NOT NULL CHECK ("rating" BETWEEN 1 AND 5),
  "comment" TEXT,
  "page_url" TEXT NOT NULL,
  "user_agent" TEXT,
  "ip_address" TEXT,
  "performance_data" JSONB,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for efficient querying
CREATE INDEX "user_feedback_feedback_type_idx" ON "monitoring"."user_feedback" ("feedback_type");
CREATE INDEX "user_feedback_rating_idx" ON "monitoring"."user_feedback" ("rating");
CREATE INDEX "user_feedback_created_at_idx" ON "monitoring"."user_feedback" ("created_at");

-- RLS Policies for security
ALTER TABLE "monitoring"."performance_metrics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "monitoring"."user_feedback" ENABLE ROW LEVEL SECURITY;

-- Policy to allow anonymous inserts for metrics and feedback
CREATE POLICY "Allow anonymous inserts for metrics" 
ON "monitoring"."performance_metrics" FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts for feedback" 
ON "monitoring"."user_feedback" FOR INSERT TO anon WITH CHECK (true);

-- Policy to allow service role to select all
CREATE POLICY "Allow service role to select all metrics" 
ON "monitoring"."performance_metrics" FOR SELECT TO service_role USING (true);

CREATE POLICY "Allow service role to select all feedback" 
ON "monitoring"."user_feedback" FOR SELECT TO service_role USING (true);

-- Create a view for performance metrics aggregation
CREATE OR REPLACE VIEW "monitoring"."performance_metrics_daily" AS
SELECT 
  DATE_TRUNC('day', created_at) AS day,
  metric_name,
  COUNT(*) AS total_count,
  ROUND(AVG(metric_value)::numeric, 2) AS avg_value,
  ROUND(PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY metric_value)::numeric, 2) AS p75_value,
  ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY metric_value)::numeric, 2) AS p95_value,
  COUNT(*) FILTER (WHERE category = 'good') AS good_count,
  COUNT(*) FILTER (WHERE category = 'needs-improvement') AS needs_improvement_count,
  COUNT(*) FILTER (WHERE category = 'poor') AS poor_count
FROM 
  "monitoring"."performance_metrics"
GROUP BY 
  DATE_TRUNC('day', created_at), metric_name
ORDER BY 
  day DESC, metric_name;
