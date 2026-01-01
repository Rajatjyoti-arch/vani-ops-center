-- ==========================================
-- 0. EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. CLEANUP (Drop existing tables/triggers)
-- ==========================================
DROP TRIGGER IF EXISTS on_report_created ON reports;
DROP TRIGGER IF EXISTS on_report_resolved ON reports;
DROP TRIGGER IF EXISTS on_report_change ON reports;
DROP TRIGGER IF EXISTS on_negotiation_created ON arena_negotiations;
DROP TRIGGER IF EXISTS on_negotiation_completed ON arena_negotiations;
DROP TRIGGER IF EXISTS on_vault_deleted ON stealth_vault;
DROP TRIGGER IF EXISTS on_report_deleted ON reports;
DROP TRIGGER IF EXISTS on_reputation_change ON ghost_identities;

DROP FUNCTION IF EXISTS log_new_report;
DROP FUNCTION IF EXISTS log_resolved_report;
DROP FUNCTION IF EXISTS update_campus_stats;
DROP FUNCTION IF EXISTS log_new_negotiation;
DROP FUNCTION IF EXISTS log_completed_negotiation;
DROP FUNCTION IF EXISTS log_deleted_vault;
DROP FUNCTION IF EXISTS log_deleted_report;
DROP FUNCTION IF EXISTS log_reputation_change;

DROP TABLE IF EXISTS sentiment_logs;
DROP TABLE IF EXISTS campus_sentiment_stats;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS locations;

-- Clean existing data from preserved tables
TRUNCATE TABLE activity_logs;
TRUNCATE TABLE ghost_identities CASCADE;
TRUNCATE TABLE stealth_vault CASCADE;

-- ==========================================
-- 2. SCHEMA CREATION
-- ==========================================

-- Locations Table
CREATE TABLE locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reports Table
CREATE TABLE reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  report_id TEXT NOT NULL,
  title TEXT NOT NULL,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  category TEXT,
  severity TEXT,
  status TEXT CHECK (status IN ('open', 'in_review', 'resolved')) DEFAULT 'open',
  ghost_identity_id UUID REFERENCES ghost_identities(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sentiment Logs (History)
CREATE TABLE sentiment_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  severity TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Campus Sentiment Stats (Aggregated View for Frontend)
CREATE TABLE campus_sentiment_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE UNIQUE,
  zone_name TEXT NOT NULL,
  reports_count INTEGER DEFAULT 0,
  concern_level TEXT DEFAULT 'safe',
  last_report_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. SEED DATA (Locations)
-- ==========================================
INSERT INTO locations (name, category) VALUES
('Mess', 'Facility'),
('Chankya Building', 'Academic'),
('SPM Boys Hostel', 'Hostel'),
('BRS Boys Hostel', 'Hostel'),
('Shailputri Girls Hostel', 'Hostel'),
('Academic Block', 'Academic'),
('ISRO Building', 'Academic'),
('Aryabhatta Building', 'Academic'),
('Fabricated Building', 'Academic'),
('DDE Building', 'Academic'),
('Main Gate', 'Security');

-- Initialize Stats for each location
INSERT INTO campus_sentiment_stats (location_id, zone_name)
SELECT id, name FROM locations;

-- ==========================================
-- 4. TRIGGERS & LOGIC
-- ==========================================

-- Trigger: Update Campus Stats on Report Change
CREATE OR REPLACE FUNCTION update_campus_stats()
RETURNS TRIGGER AS $$
DECLARE
  loc_id UUID;
  active_count INTEGER;
  new_level TEXT;
BEGIN
  loc_id := COALESCE(NEW.location_id, OLD.location_id);

  -- Count active reports
  SELECT COUNT(*) INTO active_count
  FROM reports
  WHERE location_id = loc_id AND status != 'resolved';

  -- Determine Level
  IF active_count >= 6 THEN new_level := 'critical';
  ELSIF active_count >= 1 THEN new_level := 'warning';
  ELSE new_level := 'safe';
  END IF;

  -- Update Stats
  UPDATE campus_sentiment_stats
  SET reports_count = active_count,
      concern_level = new_level,
      last_report_at = NOW(),
      updated_at = NOW()
  WHERE location_id = loc_id;

  -- Log to history
  INSERT INTO sentiment_logs (location_id, severity) VALUES (loc_id, new_level);

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_report_change
AFTER INSERT OR UPDATE OR DELETE ON reports
FOR EACH ROW EXECUTE FUNCTION update_campus_stats();

-- Trigger: Log Activity (New Report)
CREATE OR REPLACE FUNCTION log_new_report()
RETURNS TRIGGER AS $$
DECLARE loc_name TEXT;
BEGIN
  SELECT name INTO loc_name FROM locations WHERE id = NEW.location_id;
  INSERT INTO activity_logs (event_type, description, actor_type, zone, created_at)
  VALUES ('report', 'New report: ' || NEW.title, 'Anonymous', loc_name, NEW.created_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_report_created
AFTER INSERT ON reports
FOR EACH ROW EXECUTE FUNCTION log_new_report();

-- Trigger: Log Activity (Resolved Report)
CREATE OR REPLACE FUNCTION log_resolved_report()
RETURNS TRIGGER AS $$
DECLARE loc_name TEXT;
BEGIN
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    SELECT name INTO loc_name FROM locations WHERE id = NEW.location_id;
    INSERT INTO activity_logs (event_type, description, actor_type, zone, created_at)
    VALUES ('resolution', 'Issue resolved: ' || NEW.title, 'Admin', loc_name, NEW.updated_at);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_report_resolved
AFTER UPDATE ON reports
FOR EACH ROW EXECUTE FUNCTION log_resolved_report();

-- ==========================================
-- 5. SEED DATA (Activity Logs)
-- ==========================================
INSERT INTO activity_logs (event_type, description, actor_type, zone, created_at) VALUES
('system', 'System initialized with VANI-OS v2.4.0', 'System', NULL, NOW() - INTERVAL '2 hours'),
('report', 'New report: Water cooler malfunction', 'Anonymous', 'Mess', NOW() - INTERVAL '1 hour'),
('identity', 'New anonymous identity registered', 'System', NULL, NOW() - INTERVAL '45 minutes'),
('vault', 'Evidence uploaded: Canteen hygiene photos', 'Anonymous', NULL, NOW() - INTERVAL '30 minutes'),
('report', 'New report: Library AC not working', 'Anonymous', 'Chankya Building', NOW() - INTERVAL '15 minutes');

-- ==========================================
-- 6. ADDITIONAL ACTIVITY TRIGGERS
-- ==========================================

-- Negotiations
CREATE OR REPLACE FUNCTION log_new_negotiation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_logs (event_type, description, actor_type, created_at)
  VALUES ('negotiation', 'New resolution session started', 'System', NEW.created_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_negotiation_created AFTER INSERT ON arena_negotiations
FOR EACH ROW EXECUTE FUNCTION log_new_negotiation();

CREATE OR REPLACE FUNCTION log_completed_negotiation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO activity_logs (event_type, description, actor_type, created_at)
    VALUES ('resolution', 'Resolution reached: ' || COALESCE(NEW.final_consensus, 'Case closed'), 'System', NEW.updated_at);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_negotiation_completed AFTER UPDATE ON arena_negotiations
FOR EACH ROW EXECUTE FUNCTION log_completed_negotiation();

-- Deletions
CREATE OR REPLACE FUNCTION log_deleted_vault()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_logs (event_type, description, actor_type, created_at)
  VALUES ('vault', 'Evidence file removed: ' || OLD.file_name, 'Anonymous', NOW());
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_vault_deleted AFTER DELETE ON stealth_vault
FOR EACH ROW EXECUTE FUNCTION log_deleted_vault();

CREATE OR REPLACE FUNCTION log_deleted_report()
RETURNS TRIGGER AS $$
DECLARE loc_name TEXT;
BEGIN
  SELECT name INTO loc_name FROM locations WHERE id = OLD.location_id;
  INSERT INTO activity_logs (event_type, description, actor_type, zone, created_at)
  VALUES ('report', 'Report removed: ' || OLD.title, 'Admin', loc_name, NOW());
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_report_deleted AFTER DELETE ON reports
FOR EACH ROW EXECUTE FUNCTION log_deleted_report();

-- Reputation
CREATE OR REPLACE FUNCTION log_reputation_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reputation != OLD.reputation THEN
    INSERT INTO activity_logs (event_type, description, actor_type, created_at)
    VALUES ('identity', 'Reputation updated for ' || NEW.ghost_name || ': ' || NEW.reputation || '%', 'System', NOW());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_reputation_change AFTER UPDATE ON ghost_identities
FOR EACH ROW EXECUTE FUNCTION log_reputation_change();
