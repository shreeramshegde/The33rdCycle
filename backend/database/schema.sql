-- =============================================================================
-- THE 33RD CYCLE // CHRONOS SUBMISSION PORTAL
-- DATABASE INITIALIZATION SCHEMA (PostgreSQL / NeonDB)
-- =============================================================================

-- Enable UUID extension for secure random IDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if re-initializing
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS checkpoints CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS system_config CASCADE;

-- -----------------------------------------------------------------------------
-- 1. SYSTEM CONFIGURATION TABLE
-- Controls global portal states (e.g. Freezing the event, global timers)
-- -----------------------------------------------------------------------------
CREATE TABLE system_config (
    config_key VARCHAR(50) PRIMARY KEY,
    config_value VARCHAR(255) NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 2. ADMIN ACCOUNTS TABLE
-- IEEE Core committee accounts for Swagger UI authentication
-- -----------------------------------------------------------------------------
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'ROLE_ADMIN' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 3. PARTICIPANT TEAMS TABLE
-- Stores team credentials, live scores, and progress
-- -----------------------------------------------------------------------------
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_code VARCHAR(30) UNIQUE NOT NULL,        -- e.g. "TEAM_01", "TEAM_ALPHA"
    team_name VARCHAR(100) NOT NULL,               -- e.g. "Paradox Hunters"
    password_hash VARCHAR(255) NULL,
    total_score INT DEFAULT 100 NOT NULL,          -- Event Rule: Every team begins with 100 points
    completed_checkpoints INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_teams_code ON teams(team_code);

-- -----------------------------------------------------------------------------
-- 4. CHECKPOINTS & GROUND-TRUTH ANSWERS TABLE
-- Defines the 6 stages and ground-truth validation criteria
-- -----------------------------------------------------------------------------
CREATE TABLE checkpoints (
    id VARCHAR(20) PRIMARY KEY,                    -- e.g. "ROUND_0", "CP_1" ... "CP_5"
    title VARCHAR(100) NOT NULL,                   -- e.g. "The Secondary Override"
    stage_label VARCHAR(50) NOT NULL,              -- e.g. "Checkpoint 4"
    normalized_answer VARCHAR(100) NOT NULL,       -- Normalized truth: "CH033"
    accepted_aliases TEXT[],                       -- Array of acceptable formats: ['CH-0-33', 'CH 0 33']
    max_points INT DEFAULT 20 NOT NULL,            -- +20 completion bonus rule
    penalty_points INT DEFAULT 5 NOT NULL,         -- Penalty per hint
    order_index INT NOT NULL,                      -- Ordering sequence (0 to 5)
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- -----------------------------------------------------------------------------
-- 5. AUDIT & SUBMISSIONS TABLE
-- Logs every single submission attempt for live scoring and verification
-- -----------------------------------------------------------------------------
CREATE TABLE submissions (
    id BIGSERIAL PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    checkpoint_id VARCHAR(20) NOT NULL REFERENCES checkpoints(id) ON DELETE RESTRICT,
    raw_submitted_value TEXT NOT NULL,
    normalized_value VARCHAR(100) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    points_awarded INT DEFAULT 0 NOT NULL,
    attempt_number INT NOT NULL DEFAULT 1,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_submissions_team ON submissions(team_id);
CREATE INDEX idx_submissions_checkpoint ON submissions(checkpoint_id);
CREATE INDEX idx_submissions_team_cp_correct ON submissions(team_id, checkpoint_id, is_correct);
