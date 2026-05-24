import { formatDate } from "@/lib/format";
import { getSyncSummary } from "@/lib/properties";

export const dynamic = "force-dynamic";

const samplePayload = `{
  "properties": [
    {
      "property_id": "DXB-001",
      "name": "Marina View 1BR",
      "area": "Dubai Marina",
      "building": "Marina Heights",
      "price": 1250000,
      "price_sqft": 1650,
      "size_sqft": 758,
      "target_price": 1200000,
      "area_avg_price_sqft": 1750,
      "watched": true,
      "last_updated": "2026-05-15T09:30:00.000Z"
    }
  ]
}`;

export default function SyncStatusPage() {
  const sync = getSyncSummary();

  return (
    <div className="grid detail-grid">
      <section className="card">
        <h2>Data Sync Status</h2>
        <dl className="definition-list">
          <div>
            <dt>Total records</dt>
            <dd>{sync.total}</dd>
          </div>
          <div>
            <dt>Watched records</dt>
            <dd>{sync.watched}</dd>
          </div>
          <div>
            <dt>Last database update</dt>
            <dd>{formatDate(sync.last_updated)}</dd>
          </div>
          <div>
            <dt>SQLite path</dt>
            <dd>{sync.dbPath}</dd>
          </div>
        </dl>
      </section>
      <section className="card">
        <h2>n8n endpoint</h2>
        <p className="small-text">Send a POST request to <strong>/api/n8n/sync</strong> with either a single property, an array, or an object with a properties array.</p>
        <pre className="code-block"><code>{samplePayload}</code></pre>
      </section>
    </div>
  );
}
