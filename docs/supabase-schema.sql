-- ExamFlow AI — Supabase PostgreSQL Schema
-- Run in: Supabase Dashboard → SQL Editor → New Query

-- ── Extensions ────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for full-text search

-- ── Enums ─────────────────────────────────────────────────────────────────────
CREATE TYPE exam_type AS ENUM ('FINAL', 'MIDTERM', 'QUIZ', 'ASSIGNMENT');

-- ── Tables ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS exams (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       TEXT NOT NULL,                    -- Clerk user ID
  course_code   TEXT NOT NULL,
  course_title  TEXT NOT NULL,
  exam_type     exam_type NOT NULL DEFAULT 'FINAL',
  start_time    TIMESTAMPTZ NOT NULL,
  end_time      TIMESTAMPTZ NOT NULL,
  semester      TEXT NOT NULL,
  location      TEXT,
  credit_hours  SMALLINT CHECK (credit_hours >= 0 AND credit_hours <= 12),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS study_plans (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     TEXT NOT NULL,
  exam_ids    UUID[] NOT NULL DEFAULT '{}',
  content     TEXT NOT NULL,
  model       TEXT NOT NULL DEFAULT 'claude-3-5-sonnet-20241022',
  prompt      TEXT,
  daily_hours SMALLINT DEFAULT 6,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conflicts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     TEXT NOT NULL,
  exam_id_a   UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  exam_id_b   UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  type        TEXT NOT NULL DEFAULT 'OVERLAP',
  severity    TEXT NOT NULL DEFAULT 'HIGH' CHECK (severity IN ('HIGH','MEDIUM','LOW')),
  message     TEXT,
  resolved    BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usage_events (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    TEXT NOT NULL,
  event      TEXT NOT NULL,   -- 'study_plan_generated', 'nlp_parsed', etc.
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ────────────────────────────────────────────────────────────────────
CREATE INDEX idx_exams_user_id       ON exams(user_id);
CREATE INDEX idx_exams_start_time    ON exams(start_time);
CREATE INDEX idx_exams_semester      ON exams(semester);
CREATE INDEX idx_study_plans_user_id ON study_plans(user_id);
CREATE INDEX idx_conflicts_user_id   ON conflicts(user_id);
CREATE INDEX idx_usage_events_user   ON usage_events(user_id, event);

-- ── Updated_at trigger ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER exams_updated_at BEFORE UPDATE ON exams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ─────────────────────────────────────────────────────────
ALTER TABLE exams         ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans   ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflicts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events  ENABLE ROW LEVEL SECURITY;

-- Users see only their own data (Clerk JWT sub claim = user_id)
CREATE POLICY exams_rls ON exams FOR ALL
  USING (user_id = (current_setting('request.jwt.claims', true)::json->>'sub'));
CREATE POLICY study_plans_rls ON study_plans FOR ALL
  USING (user_id = (current_setting('request.jwt.claims', true)::json->>'sub'));
CREATE POLICY conflicts_rls ON conflicts FOR ALL
  USING (user_id = (current_setting('request.jwt.claims', true)::json->>'sub'));
CREATE POLICY usage_events_rls ON usage_events FOR ALL
  USING (user_id = (current_setting('request.jwt.claims', true)::json->>'sub'));

-- ── Seed data (demo) ───────────────────────────────────────────────────────────
-- Replace 'demo_user_id' with your actual Clerk user ID after first sign-in
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM exams WHERE user_id = 'demo_user_id') THEN
    INSERT INTO exams (user_id, course_code, course_title, exam_type, start_time, end_time, semester, location, credit_hours)
    VALUES
      ('demo_user_id','CS401','Algorithms & Data Structures','FINAL','2025-05-12 09:00+00','2025-05-12 11:00+00','Spring 2025','Hall A-101',4),
      ('demo_user_id','MATH301','Linear Algebra','MIDTERM','2025-05-12 10:30+00','2025-05-12 12:00+00','Spring 2025','Hall B-203',3),
      ('demo_user_id','PHYS201','Classical Mechanics','FINAL','2025-05-14 14:00+00','2025-05-14 16:00+00','Spring 2025','Lab Complex C',4),
      ('demo_user_id','CS350','Operating Systems','QUIZ','2025-05-15 13:00+00','2025-05-15 13:45+00','Spring 2025','Hall A-210',3),
      ('demo_user_id','ENG201','Technical Writing','FINAL','2025-05-16 09:00+00','2025-05-16 11:00+00','Spring 2025','Humanities 105',2);
  END IF;
END $$;
