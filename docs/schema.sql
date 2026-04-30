-- ExamFlow v2 Database Schema
-- Run: psql -U your_user -d examflow -f docs/schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS exams (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code    VARCHAR(20)  NOT NULL,
    section        VARCHAR(10),
    course_title   VARCHAR(200) NOT NULL,
    exam_type      VARCHAR(20)  NOT NULL CHECK (exam_type IN ('FINAL', 'MIDTERM', 'QUIZ')),
    start_time     TIMESTAMPTZ  NOT NULL,
    end_time       TIMESTAMPTZ  NOT NULL,
    building       VARCHAR(100),
    room           VARCHAR(50),
    seat_row_start VARCHAR(20),
    seat_row_end   VARCHAR(20),
    difficulty     SMALLINT     NOT NULL DEFAULT 3 CHECK (difficulty BETWEEN 1 AND 5),
    semester       VARCHAR(20)  NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT end_after_start CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_exams_course   ON exams (LOWER(course_code), semester);
CREATE INDEX IF NOT EXISTS idx_exams_time     ON exams (start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_exams_semester ON exams (semester);

CREATE TABLE IF NOT EXISTS ai_response_cache (
    cache_key   CHAR(64)    PRIMARY KEY,
    response    TEXT        NOT NULL,
    endpoint    VARCHAR(50) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at  TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cache_expires ON ai_response_cache (expires_at);

INSERT INTO exams
  (course_code, section, course_title, exam_type, start_time, end_time, building, room, difficulty, semester)
VALUES
  ('CS301',  'A', 'Data Structures',  'FINAL',   '2025-05-12 09:00:00-04', '2025-05-12 12:00:00-04', 'Engineering', '101', 4, 'SPRING2025'),
  ('MATH201','B', 'Calculus II',       'FINAL',   '2025-05-14 13:00:00-04', '2025-05-14 15:00:00-04', 'Science',     '204', 3, 'SPRING2025'),
  ('ENG102', 'A', 'Technical Writing', 'FINAL',   '2025-05-16 10:00:00-04', '2025-05-16 12:00:00-04', 'Humanities',  '310', 2, 'SPRING2025'),
  ('CS401',  'A', 'Machine Learning',  'FINAL',   '2025-05-19 09:00:00-04', '2025-05-19 12:00:00-04', 'Engineering', '205', 5, 'SPRING2025'),
  ('PHYS301','C', 'Quantum Mechanics', 'MIDTERM', '2025-05-13 14:00:00-04', '2025-05-13 16:00:00-04', 'Science',     '101', 5, 'SPRING2025')
ON CONFLICT DO NOTHING;
