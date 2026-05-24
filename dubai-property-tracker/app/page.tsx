import Link from "next/link";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { getAlerts, getDealStatus, getProperties, getSyncSummary, type PropertyRecord } from "@/lib/properties";

export const dynamic = "force-dynamic";

function statusClass(status: string) {
  if (status === "Good Deal") return "good";
  if (status === "Fair Price") return "fair";
  if (status === "Overpriced") return "bad";
  return "neutral";
}

function PropertyRow({ property }: { property: PropertyRecord }) {
  const status = getDealStatus(property);

  return (
    <article className="property-row">
      <div>
        <h3>{property.name || property.property_id}</h3>
        <div className="meta">{property.area} · {property.building}</div>
      </div>
      <div>
        <div className="meta">Price</div>
        <div className="price">{formatCurrency(property.price)}</div>
      </div>
      <div>
        <div className="meta">AED / sqft</div>
        <div className="price">{formatNumber(property.price_sqft)}</div>
      </div>
      <div>
        <span className={`badge ${statusClass(status)}`}>{status}</span>
      </div>
      <Link className="button" href={`/properties/${property.property_id}`}>Details</Link>
    </article>
  );
}

export default function Dashboard() {
  const properties = getProperties();
  const alerts = getAlerts();
  const sync = getSyncSummary();
  const goodDeals = properties.filter((property) => getDealStatus(property) === "Good Deal").length;

  return (
    <div className="grid">
      <section className="grid stats-grid" aria-label="Portfolio summary">
        <div className="card">
          <div className="stat-label">Tracked properties</div>
          <div className="stat-value">{properties.length}</div>
        </div>
        <div className="card">
          <div className="stat-label">Watched</div>
          <div className="stat-value">{sync.watched}</div>
        </div>
        <div className="card">
          <div className="stat-label">Good deals</div>
          <div className="stat-value">{goodDeals}</div>
        </div>
        <div className="card">
          <div className="stat-label">Active alerts</div>
          <div className="stat-value">{alerts.length}</div>
        </div>
      </section>

      <section className="card">
        <div className="section-header">
          <div>
            <h2>Dashboard</h2>
            <p className="small-text">Database-backed property list. Last sync: {formatDate(sync.last_updated)}</p>
          </div>
          <Link className="button" href="/sync-status">Sync status</Link>
        </div>
        <div className="property-list">
          {properties.length === 0 ? (
            <p className="empty">No properties yet. Send data to POST /api/n8n/sync from n8n to populate this dashboard.</p>
          ) : (
            properties.map((property) => <PropertyRow key={property.property_id} property={property} />)
          )}
        </div>
      </section>
    </div>
  );
}
