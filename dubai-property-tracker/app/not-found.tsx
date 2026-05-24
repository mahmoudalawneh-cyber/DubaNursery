import Link from "next/link";

export default function NotFound() {
  return (
    <section className="card">
      <h2>Property not found</h2>
      <p className="empty">This property is not in your local SQLite tracker.</p>
      <Link className="button" href="/">Back to dashboard</Link>
    </section>
  );
}
