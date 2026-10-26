-- =============================================================================
-- THE 33RD CYCLE // CHRONOS SUBMISSION PORTAL
-- DATABASE SEED DATA (PostgreSQL / NeonDB)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. SYSTEM CONFIGURATION
-- -----------------------------------------------------------------------------
INSERT INTO system_config (config_key, config_value, description) VALUES
('PORTAL_FROZEN', 'FALSE', 'Set to TRUE when the event concludes or during scoring freeze'),
('EVENT_TITLE', 'THE 33RD CYCLE // CHRONOS INVESTIGATION PORTAL', 'Display title for portal header'),
('STARTING_SCORE', '100', 'Initial points allocated to every participating team'),
('COMPLETION_BONUS', '20', 'Points awarded per successfully verified checkpoint');

-- -----------------------------------------------------------------------------
-- 2. DEFAULT ADMIN ACCOUNT
-- Username: admin
-- Password: admin123 (BCrypt Hash: $2a$10$XptfskLsT1l/bRTLRiiCgejHqOpgXFreUnNUa35gJdCr2v2QbVF3G)
-- -----------------------------------------------------------------------------
INSERT INTO admins (username, password_hash, full_name, role) VALUES
('admin', '$2a$10$XptfskLsT1l/bRTLRiiCgejHqOpgXFreUnNUa35gJdCr2v2QbVF3G', 'IEEE Core Administrator', 'ROLE_ADMIN');

-- -----------------------------------------------------------------------------
-- 3. THE 6 OFFICIAL CHECKPOINTS (From The 33rd Cycle Report)
-- -----------------------------------------------------------------------------
INSERT INTO checkpoints (id, title, stage_label, normalized_answer, accepted_aliases, max_points, penalty_points, order_index, is_active) VALUES
(
    'ROUND_0',
    'Incident Log Clock Calibration',
    'Opening Case Dossier',
    '23:59:33',
    ARRAY['23:59:33', '11:59:33', '11:59:33 PM', '235933', '115933', '23:59:33 PM', '23.59.33', '11.59.33', '23 59 33', '11 59 33'],
    20,
    5,
    0,
    TRUE
),
(
    'CP_1',
    'The Last Transmission (Hamming Parity)',
    'Checkpoint 1',
    '1993AND2059',
    ARRAY['1993 and 2059', '1993 & 2059', '1993, 2059', '1993 2059', '1993-2059', '1993/2059', '19932059', '1993AND2059', '2059 and 1993', '2059 & 1993', '2059, 1993', '2059 1993', '2059-1993', '2059AND1993', 'YEAR 1993 AND YEAR 2059', '1993,2059'],
    20,
    5,
    1,
    TRUE
),
(
    'CP_2',
    'The Unreliable Witness (Elias Verification)',
    'Checkpoint 2',
    '1993AND2059',
    ARRAY['1993 and 2059', '1993 & 2059', '1993, 2059', '1993 2059', '1993-2059', '1993/2059', '19932059', '1993AND2059', '2059 and 1993', '2059 & 1993', '2059, 1993', '2059 1993', '2059-1993', '2059AND1993', 'YEAR 1993 AND YEAR 2059', '1993,2059'],
    20,
    5,
    2,
    TRUE
),
(
    'CP_3',
    'The CHRONOS Terminal (FSM Sequence)',
    'Checkpoint 3',
    '1101',
    ARRAY['1101', '1-1-0-1', '1 1 0 1', '1,1,0,1'],
    20,
    5,
    3,
    TRUE
),
(
    'CP_4',
    'The Secondary Override (Logic & Timing)',
    'Checkpoint 4',
    'CH033',
    ARRAY['CH-0-33', 'CH033', 'CH 0 33', 'CH-033', 'CH_0_33'],
    20,
    5,
    4,
    TRUE
),
(
    'CP_5',
    'The Archival Grid (Sudoku Consensus)',
    'Checkpoint 5',
    '23:59:33',
    ARRAY['23:59:33', '235933', '11:59:33', '11:59:33 PM', '115933', '23:59:33 PM', '23.59.33', '11.59.33', '23 59 33', '11 59 33'],
    20,
    5,
    5,
    TRUE
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    stage_label = EXCLUDED.stage_label,
    normalized_answer = EXCLUDED.normalized_answer,
    accepted_aliases = EXCLUDED.accepted_aliases,
    max_points = EXCLUDED.max_points,
    penalty_points = EXCLUDED.penalty_points,
    order_index = EXCLUDED.order_index,
    is_active = EXCLUDED.is_active;

-- -----------------------------------------------------------------------------
-- 4. 10 COMPETITION TEAMS + 5 DUMMY / TEST BENCH TEAMS
-- Starting Score: 100 Points
-- Initial Password: NULL (Claimed by each team dynamically upon first login)
-- -----------------------------------------------------------------------------
INSERT INTO teams (team_code, team_name, password_hash, total_score, completed_checkpoints, is_active) VALUES
-- 10 Competition Teams
('TEAM_01', 'Paradox Seekers', NULL, 100, 0, TRUE),
('TEAM_02', 'Quantum Observers', NULL, 100, 0, TRUE),
('TEAM_03', 'Temporal Shift', NULL, 100, 0, TRUE),
('TEAM_04', 'Entropy Wardens', NULL, 100, 0, TRUE),
('TEAM_05', 'Chronos Vanguard', NULL, 100, 0, TRUE),
('TEAM_06', 'Singularity Unit', NULL, 100, 0, TRUE),
('TEAM_07', 'Event Horizon', NULL, 100, 0, TRUE),
('TEAM_08', 'Causal Loop', NULL, 100, 0, TRUE),
('TEAM_09', 'Tachyon Pulse', NULL, 100, 0, TRUE),
('TEAM_10', 'Zero Point', NULL, 100, 0, TRUE),

-- 5 Dummy / Test Bench Teams
('DUMMY_01', 'IEEE Test Alpha', NULL, 100, 0, TRUE),
('DUMMY_02', 'IEEE Test Beta', NULL, 100, 0, TRUE),
('DUMMY_03', 'IEEE Test Gamma', NULL, 100, 0, TRUE),
('DUMMY_04', 'IEEE Test Delta', NULL, 100, 0, TRUE),
('DUMMY_05', 'IEEE Test Epsilon', NULL, 100, 0, TRUE)
ON CONFLICT (team_code) DO NOTHING;
