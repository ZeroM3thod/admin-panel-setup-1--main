-- ═══════════════════════════════════════════════════════════════
-- FIX: Function Parameter Name Conflict
-- ═══════════════════════════════════════════════════════════════
-- Run this BEFORE running FINAL-COMPLETE-SETUP.sql

-- Drop the existing function
DROP FUNCTION IF EXISTS is_admin(uuid);

-- ═══════════════════════════════════════════════════════════════
-- Now you can run FINAL-COMPLETE-SETUP.sql successfully
-- ═══════════════════════════════════════════════════════════════
