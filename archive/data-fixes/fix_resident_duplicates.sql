-- ===========================================================================
--  Fix the two duplicate / wrong-STIR resident records
--  ---------------------------------------------------------------------
--  Run AFTER the Nhost -> Neon migration:
--      psql $neon -v ON_ERROR_STOP=1 -f fix_resident_duplicates.sql
--
--  Both companies were registered on 2026-04-02 under placeholder STIR
--  numbers, before their real ones were known. Two records got created for
--  IT Centr Nishon as a result.
--
--  Safe to run twice: everything matches on registrationNumber, so a second
--  run simply updates 0 rows.
-- ===========================================================================

BEGIN;

-- --- Before ----------------------------------------------------------------
\echo '--- BEFORE ---'
SELECT status, count(*) AS residents FROM residents GROUP BY status ORDER BY status;

-- --- 1. Edits Group --------------------------------------------------------
-- One record, right company, placeholder STIR 3172217. Just correct the number.
UPDATE residents
   SET "registrationNumber" = '312906043',
       "updatedAt"          = now()
 WHERE "registrationNumber" = '3172217';

-- --- 2. IT Centr Nishon ----------------------------------------------------
-- Two records exist:
--   res-0052  STIR 3164659    ACTIVE     has director + applied/approved dates
--   res-0379  STIR 312908626  POTENTIAL  register entry only, no director
--
-- The ACTIVE one is the real resident, so it survives. The POTENTIAL entry is
-- deleted FIRST, because it is holding the correct STIR and registrationNumber
-- is a UNIQUE column - the update below would fail while it exists.
-- Nothing in the database references it (checked: no foreign keys on residents,
-- and no activity log points at it).
DELETE FROM residents
 WHERE "registrationNumber" = '312908626'
   AND status = 'POTENTIAL';

UPDATE residents
   SET "registrationNumber" = '312908626',
       "updatedAt"          = now()
 WHERE "registrationNumber" = '3164659';

-- --- After -----------------------------------------------------------------
\echo '--- AFTER ---'
SELECT status, count(*) AS residents FROM residents GROUP BY status ORDER BY status;

\echo '--- the two corrected records ---'
SELECT "registrationNumber", status, "companyName", director
  FROM residents
 WHERE "registrationNumber" IN ('312906043', '312908626')
 ORDER BY "registrationNumber";

\echo '--- any placeholder STIRs left? (should return no rows) ---'
SELECT "registrationNumber", "companyName", status
  FROM residents
 WHERE length("registrationNumber") < 9
 ORDER BY "registrationNumber";

COMMIT;
