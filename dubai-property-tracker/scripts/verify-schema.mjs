import { DatabaseSync } from "node:sqlite";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const expectedColumns = [
  "property_id",
  "name",
  "area",
  "building",
  "price",
  "price_sqft",
  "size_sqft",
  "target_price",
  "area_avg_price_sqft",
  "watched",
  "last_updated",
];

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dubai-property-tracker-"));
const dbPath = path.join(tempDir, "test.db");
const database = new DatabaseSync(dbPath);

database.exec(`
  CREATE TABLE properties (
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

const actualColumns = database.prepare("PRAGMA table_info(properties)").all().map((column) => column.name);
assert.deepEqual(actualColumns, expectedColumns);

database.close();
fs.rmSync(tempDir, { recursive: true, force: true });

console.log(`Verified property schema columns: ${actualColumns.join(",")}`);
