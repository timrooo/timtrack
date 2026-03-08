export function applySchema(db) {
    db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      site_code TEXT NOT NULL,
      address TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      progress_pct INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS floors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES projects(id),
      name TEXT NOT NULL,
      parts_delivered_pct INTEGER NOT NULL DEFAULT 0,
      constructions_total INTEGER NOT NULL DEFAULT 0,
      constructions_done INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS constructions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      floor_id INTEGER NOT NULL REFERENCES floors(id),
      project_id INTEGER NOT NULL REFERENCES projects(id),
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ready',
      parts_total INTEGER NOT NULL DEFAULT 0,
      parts_on_site INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS parts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      construction_id INTEGER NOT NULL REFERENCES constructions(id),
      number INTEGER NOT NULL,
      name_he TEXT NOT NULL,
      name_ru TEXT,
      dimensions TEXT NOT NULL DEFAULT '',
      material TEXT NOT NULL DEFAULT '',
      color TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'warehouse'
    );

    CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      part_id INTEGER NOT NULL REFERENCES parts(id),
      construction_id INTEGER NOT NULL REFERENCES constructions(id),
      type TEXT NOT NULL,
      comment TEXT NOT NULL,
      urgency TEXT NOT NULL DEFAULT 'medium',
      reported_by TEXT NOT NULL DEFAULT 'worker',
      raw_input TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS scan_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      part_id INTEGER NOT NULL REFERENCES parts(id),
      scanned_by TEXT NOT NULL,
      location TEXT NOT NULL DEFAULT '',
      event TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
