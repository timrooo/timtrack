import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { applySchema } from './schema';
import { seed } from './seed';
let db = null;
export function getDb() {
    if (db)
        return db;
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, 'timtrack.db');
    const isNew = !fs.existsSync(dbPath);
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    applySchema(db);
    if (isNew) {
        seed(db);
    }
    return db;
}
