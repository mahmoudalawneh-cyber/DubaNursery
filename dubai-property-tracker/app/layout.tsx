import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dubai Property Price Tracker",
  description: "Personal tracker for Dubai real estate prices and buying opportunities.",
};

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/alerts", label: "Alerts" },
  { href: "/sync-status", label: "Data Sync Status" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="header">
            <div className="header-content">
              <p className="kicker">Personal Dubai real estate tracker</p>
              <h1>Dubai Property Price Tracker</h1>
              <p>
                Track watched properties, compare price per sqft against area averages, and surface target-price or below-market alerts from your n8n data sync.
              </p>
              <nav className="nav" aria-label="Primary navigation">
                {navItems.map((item) => (
                  <Link href={item.href} key={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
