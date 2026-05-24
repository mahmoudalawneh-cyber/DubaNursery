import Link from "next/link";
import { formatCurrency, formatNumber } from "@/lib/format";
import { getDealStatus, getWatchedProperties } from "@/lib/properties";

export const dynamic = "force-dynamic";

export default function WatchlistPage() {
  const properties = getWatchedProperties();

  return (
    <section className="card">
      <div className="section-header">
        <div>
          <h2>Watchlist</h2>
          <p className="small-text">Properties marked watched in your Google Sheet or n8n payload.</p>
        </div>
        <Link className="button" href="/">Dashboard</Link>
      </div>
      <div className="property-list">
        {properties.length === 0 ? (
          <p className="empty">No watched properties yet.</p>
        ) : (
          properties.map((property) => (
            <article className="property-row" key={property.property_id}>
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
                <span className="badge neutral">{getDealStatus(property)}</span>
              </div>
              <Link className="button" href={`/properties/${property.property_id}`}>Details</Link>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
