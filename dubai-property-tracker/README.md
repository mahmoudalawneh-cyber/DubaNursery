# Dubai Property Price Tracker

A personal-use Next.js app for tracking Dubai real estate prices, syncing property rows from n8n, and spotting buying opportunities from local SQLite data.

## Features

- Next.js App Router with TypeScript.
- Local SQLite database stored in `data/dubai-property-tracker.db` by default.
- Database-backed Dashboard, Watchlist, Property Details, Alerts, and Data Sync Status pages.
- n8n webhook receiver at `POST /api/n8n/sync`.
- Responsive mobile-friendly layout.
- No login, subscriptions, checkout, lead capture, or commercial workflow.

## Opportunity logic

- **Good Deal**: `price_sqft` is more than 3% below `area_avg_price_sqft`.
- **Fair Price**: `price_sqft` is within 3% of `area_avg_price_sqft`.
- **Overpriced**: `price_sqft` is more than 3% above `area_avg_price_sqft`.
- **Target price alert**: `price <= target_price`.
- **Below-average alert**: `price_sqft < area_avg_price_sqft`.

## Setup

Node.js 24 or newer is recommended because this app uses the built-in `node:sqlite` module for local SQLite storage.


```bash
npm install
npm run db:init
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).


## Personal-use activation plan (non-commercial)

Yes — because this is **personal use only**, you can activate it with a simpler setup than a commercial product.

### Recommended personal setup

1. Run the app on your own machine or private home server (no public signup, no billing, no multi-user auth).
2. Keep SQLite local using the default `data/dubai-property-tracker.db`.
3. Run n8n on the same machine (or private network) and post directly to `http://localhost:3000/api/n8n/sync`.
4. Protect webhook sync with a private secret header in n8n and in your app route before accepting data.
5. Use OS scheduler/cron for backups of the `data/` folder (daily is enough for most personal workflows).

### Minimal activation checklist (personal)

```bash
npm install
npm run db:init
npm run db:verify-schema
npm run dev
```

Then in n8n, send the sample payload format from `docs/n8n-sample-payload.json` to:

```text
http://localhost:3000/api/n8n/sync
```

### What you can skip for personal use

- Multi-tenant auth systems
- Team role permissions
- Commercial analytics/billing
- Complex cloud scaling and autoscaling

You can add those later only if your use-case grows beyond private personal tracking.

## Sync data from n8n

Configure n8n to send a `POST` request to:

```text
http://localhost:3000/api/n8n/sync
```

The endpoint accepts any of these shapes:

1. A single property object.
2. An array of property objects.
3. An object with a `properties` array.

Example:

```json
{
  "properties": [
    {
      "property_id": "prop_1",
      "name": "Marina View Apartment",
      "area": "Dubai Marina",
      "building": "Marina View Tower",
      "price": 950000,
      "price_sqft": 1700,
      "size_sqft": 560,
      "target_price": 850000,
      "area_avg_price_sqft": 1800,
      "watched": true,
      "last_updated": "2026-05-16"
    }
  ]
}
```

Test locally with curl:

```bash
curl -X POST http://localhost:3000/api/n8n/sync \
  -H "Content-Type: application/json" \
  --data @docs/n8n-sample-payload.json
```

## Google Sheet structure

Use these exact Google Sheet headers, in this order:

```csv
property_id,name,area,building,price,price_sqft,size_sqft,target_price,area_avg_price_sqft,watched,last_updated
```

Example row:

```csv
prop_1,Marina View Apartment,Dubai Marina,Marina View Tower,950000,1700,560,850000,1800,true,2026-05-16
```

See [`docs/google-sheet-columns.md`](docs/google-sheet-columns.md) and [`docs/google-sheet-template.csv`](docs/google-sheet-template.csv) for the recommended column headers and example values.

## Environment variables

Optional:

```bash
SQLITE_DB_PATH=/absolute/path/to/custom.db
```

If omitted, the app creates and uses `data/dubai-property-tracker.db`.

## Scripts

- `npm run db:init` - create the local SQLite database and `properties` table.
- `npm run db:verify-schema` - verify the SQLite `properties` table columns match the Google Sheet headers.
- `npm run dev` - start the local development server.
- `npm run build` - create a production build.
- `npm run start` - run the production build.
- `npm run typecheck` - run TypeScript checks.
- `npm run lint` - run Next.js linting.
