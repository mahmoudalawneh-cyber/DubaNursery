import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { getAlertReasons, getDealStatus, getProperty } from "@/lib/properties";

export const dynamic = "force-dynamic";

export default async function PropertyDetailsPage({ params }: { params: Promise<{ property_id: string }> }) {
  const { property_id } = await params;
  const property = getProperty(decodeURIComponent(property_id));

  if (!property) {
    notFound();
  }

  const status = getDealStatus(property);
  const alerts = getAlertReasons(property);

  return (
    <div className="grid detail-grid">
      <section className="card">
        <div className="section-header">
          <div>
            <h2>{property.name || property.property_id}</h2>
            <p className="small-text">{property.area} · {property.building}</p>
          </div>
          <Link className="button" href="/">Dashboard</Link>
        </div>
        <dl className="definition-list">
          <div>
            <dt>Property ID</dt>
            <dd>{property.property_id}</dd>
          </div>
          <div>
            <dt>Deal status</dt>
            <dd>{status}</dd>
          </div>
          <div>
            <dt>Price</dt>
            <dd>{formatCurrency(property.price)}</dd>
          </div>
          <div>
            <dt>Target price</dt>
            <dd>{formatCurrency(property.target_price)}</dd>
          </div>
          <div>
            <dt>Price per sqft</dt>
            <dd>{formatNumber(property.price_sqft)}</dd>
          </div>
          <div>
            <dt>Area average per sqft</dt>
            <dd>{formatNumber(property.area_avg_price_sqft)}</dd>
          </div>
          <div>
            <dt>Size</dt>
            <dd>{formatNumber(property.size_sqft)} sqft</dd>
          </div>
          <div>
            <dt>Watched</dt>
            <dd>{property.watched ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt>Last updated</dt>
            <dd>{formatDate(property.last_updated)}</dd>
          </div>
        </dl>
      </section>
      <aside className="card">
        <h2>Buying signals</h2>
        {alerts.length === 0 ? (
          <p className="empty">No active alerts for this property.</p>
        ) : (
          <ul>
            {alerts.map((alert) => (
              <li key={alert}>{alert}</li>
            ))}
          </ul>
        )}
        <p className="small-text">Good Deal means price per sqft is more than 3% below the area average. Fair Price means it is within 3% of the area average.</p>
      </aside>
    </div>
  );
}
