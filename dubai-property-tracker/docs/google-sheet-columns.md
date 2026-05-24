# Sample Google Sheet Column Structure

Use one row per property. Keep the header names exactly as shown so n8n can map them directly into the webhook payload.

| Column | Type | Example | Notes |
| --- | --- | --- | --- |
| property_id | Text | prop_1 | Stable unique ID for upserts. |
| name | Text | Marina View Apartment | Friendly display name. |
| area | Text | Dubai Marina | Area or community. |
| building | Text | Marina View Tower | Building or project name. |
| price | Number | 950000 | Asking or latest observed price in AED. |
| price_sqft | Number | 1700 | Price divided by size in sqft. |
| size_sqft | Number | 560 | Property size. |
| target_price | Number | 850000 | Your personal buy target. |
| area_avg_price_sqft | Number | 1800 | Current average AED/sqft for the area. |
| watched | Boolean | TRUE | TRUE/FALSE, yes/no, or 1/0 are accepted. |
| last_updated | ISO date string | 2026-05-16 | Timestamp from your sheet or workflow. |

## Copy/paste header row

```csv
property_id,name,area,building,price,price_sqft,size_sqft,target_price,area_avg_price_sqft,watched,last_updated
```

The same header row is available as [`google-sheet-template.csv`](google-sheet-template.csv).

## Example property row

```csv
prop_1,Marina View Apartment,Dubai Marina,Marina View Tower,950000,1700,560,850000,1800,true,2026-05-16
```
