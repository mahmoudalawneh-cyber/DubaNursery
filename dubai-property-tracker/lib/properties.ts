import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

export type DealStatus = "Good Deal" | "Fair Price" | "Overpriced" | "No Area Average";

export type PropertyRecord = {
  property_id: string;
  name: string;
  area: string;
  building: string;
  price: number;
  price_sqft: number;
  size_sqft: number;
  target_price: number;
  area_avg_price_sqft: number;
  watched: boolean;
  last_updated: string;
};

export type SyncPropertyInput = Partial<Omit<PropertyRecord, "watched">> & {
  property_id: string;
  watched?: boolean | number | string;
};

export type PropertyAlert = {
  property: PropertyRecord;
  reasons: string[];
};

const dataDir = path.join(process.cwd(), "data");
const dbPath = process.env.SQLITE_DB_PATH ?? path.join(dataDir, "dubai-property-tracker.db");

let db: DatabaseSync | null = null;

function getDb() {
  if (!db) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    db = new DatabaseSync(dbPath);
    db.exec("PRAGMA journal_mode = WAL");
    db.exec(`
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
  }

  return db;
}

function toNumber(value: unknown, fallback = 0) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function toBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    return ["1", "true", "yes", "y", "watched"].includes(value.trim().toLowerCase());
  }

  return false;
}

function mapProperty(row: Record<string, unknown>): PropertyRecord {
  return {
    property_id: String(row.property_id),
    name: String(row.name ?? ""),
    area: String(row.area ?? ""),
    building: String(row.building ?? ""),
    price: toNumber(row.price),
    price_sqft: toNumber(row.price_sqft),
    size_sqft: toNumber(row.size_sqft),
    target_price: toNumber(row.target_price),
    area_avg_price_sqft: toNumber(row.area_avg_price_sqft),
    watched: toBoolean(row.watched),
    last_updated: String(row.last_updated ?? ""),
  };
}

export function getDealStatus(property: Pick<PropertyRecord, "price_sqft" | "area_avg_price_sqft">): DealStatus {
  if (!property.area_avg_price_sqft) {
    return "No Area Average";
  }

  const differenceRatio = (property.price_sqft - property.area_avg_price_sqft) / property.area_avg_price_sqft;

  if (differenceRatio < -0.03) {
    return "Good Deal";
  }

  if (Math.abs(differenceRatio) <= 0.03) {
    return "Fair Price";
  }

  return "Overpriced";
}

export function getAlertReasons(property: PropertyRecord) {
  const reasons: string[] = [];

  if (property.target_price > 0 && property.price <= property.target_price) {
    reasons.push("Price is at or below your target price");
  }

  if (property.area_avg_price_sqft > 0 && property.price_sqft < property.area_avg_price_sqft) {
    reasons.push("Price per sqft is below the area average");
  }

  return reasons;
}

export function getProperties() {
  const rows = getDb()
    .prepare("SELECT * FROM properties ORDER BY watched DESC, last_updated DESC, area ASC")
    .all() as Record<string, unknown>[];

  return rows.map(mapProperty);
}

export function getWatchedProperties() {
  const rows = getDb()
    .prepare("SELECT * FROM properties WHERE watched = 1 ORDER BY last_updated DESC, area ASC")
    .all() as Record<string, unknown>[];

  return rows.map(mapProperty);
}

export function getProperty(propertyId: string) {
  const row = getDb()
    .prepare("SELECT * FROM properties WHERE property_id = ?")
    .get(propertyId) as Record<string, unknown> | undefined;

  return row ? mapProperty(row) : null;
}

export function getAlerts(): PropertyAlert[] {
  return getProperties()
    .map((property) => ({ property, reasons: getAlertReasons(property) }))
    .filter((alert) => alert.reasons.length > 0);
}

export function getSyncSummary() {
  const database = getDb();
  const summary = database
    .prepare(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN watched = 1 THEN 1 ELSE 0 END) as watched,
        MAX(last_updated) as last_updated
      FROM properties`,
    )
    .get() as { total: number; watched: number | null; last_updated: string | null };

  return {
    total: summary.total,
    watched: summary.watched ?? 0,
    last_updated: summary.last_updated,
    dbPath,
  };
}

export function upsertProperties(inputs: SyncPropertyInput[]) {
  const database = getDb();
  const statement = database.prepare(`
    INSERT INTO properties (
      property_id,
      name,
      area,
      building,
      price,
      price_sqft,
      size_sqft,
      target_price,
      area_avg_price_sqft,
      watched,
      last_updated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(property_id) DO UPDATE SET
      name = excluded.name,
      area = excluded.area,
      building = excluded.building,
      price = excluded.price,
      price_sqft = excluded.price_sqft,
      size_sqft = excluded.size_sqft,
      target_price = excluded.target_price,
      area_avg_price_sqft = excluded.area_avg_price_sqft,
      watched = excluded.watched,
      last_updated = excluded.last_updated
  `);

  database.exec("BEGIN TRANSACTION");

  try {
    for (const property of inputs) {
      statement.run(
        property.property_id,
        property.name ?? "",
        property.area ?? "",
        property.building ?? "",
        toNumber(property.price),
        toNumber(property.price_sqft),
        toNumber(property.size_sqft),
        toNumber(property.target_price),
        toNumber(property.area_avg_price_sqft),
        toBoolean(property.watched) ? 1 : 0,
        property.last_updated ?? new Date().toISOString(),
      );
    }

    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }

  return inputs.length;
}
