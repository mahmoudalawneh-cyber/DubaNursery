import { NextResponse } from "next/server";
import { upsertProperties, type SyncPropertyInput } from "@/lib/properties";

export const runtime = "nodejs";

type SyncPayload = SyncPropertyInput | SyncPropertyInput[] | { properties?: SyncPropertyInput[] } | null;

function normalizePayload(payload: SyncPayload): SyncPropertyInput[] {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  if ("properties" in payload && Array.isArray(payload.properties)) {
    return payload.properties;
  }

  return [payload as SyncPropertyInput];
}

export async function POST(request: Request) {
  let payload: SyncPayload;

  try {
    payload = (await request.json()) as SyncPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const properties = normalizePayload(payload).filter((property) => property?.property_id);

  if (properties.length === 0) {
    return NextResponse.json({ error: "Payload must include at least one property with property_id" }, { status: 400 });
  }

  const synced = upsertProperties(properties);

  return NextResponse.json({ ok: true, synced });
}
