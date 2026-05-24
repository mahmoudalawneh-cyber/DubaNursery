import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const dbPath = process.env.SQLITE_DB_PATH ?? path.join(dataDir, "dubai-property-tracker.db");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const database = new DatabaseSync(dbPath);
database.exec("PRAGMA journal_mode = WAL");
database.exec(`
  CREATE TABLE IF NOT EXISTS properties (
    property_id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    area TEXT NOT NULL DEFAULT '',
    building TEXT NOT NULL DEFAULT '',
    price REAL NOT NULL DEFAULT 0,
    price_sqft REAL NOT NULL DEFAULT 0,
    size_sqft REAL NOT NULL DEFAULT 0,
    target_price REAL NOT NULL DEFAULT 0,
    area_avg_price_sqft REAL NOT NULL DEFAULT 0,
    watched INTEGER NOT NULL DEFAULT 0,
    last_updated TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const result = database.prepare("SELECT COUNT(*) as total FROM properties").get();
database.close();

console.log(`SQLite database initialized at ${dbPath}`);
console.log(`Current property records: ${result.total}`);
