import Link from "next/link";
import { formatCurrency, formatNumber } from "@/lib/format";
import { getAlerts } from "@/lib/properties";

export const dynamic = "force-dynamic";

export default function AlertsPage() {
  const alerts = getAlerts();

  return (
    <section className="card">
      <div className="section-header">
        <div>
          <h2>Alerts</h2>
          <p className="small-text">Alerts trigger when price is at target or price per sqft is below the area average.</p>
        </div>
        <Link className="button" href="/">Dashboard</Link>
      </div>
      {alerts.length === 0 ? (
        <p className="empty">No active alerts.</p>
      ) : (
        <ul className="alert-list">
          {alerts.map(({ property, reasons }) => (
            <li className="property-row" key={property.property_id}>
              <div>
                <h3>{property.name || property.property_id}</h3>
                <div className="meta">{reasons.join(" · ")}</div>
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
                <span className="badge good">Opportunity</span>
              </div>
              <Link className="button" href={`/properties/${property.property_id}`}>Details</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
