# Airvis

Airvis is a frontend dashboard for exploring Airbnb listings in Zürich. It combines a map, price and room-type charts, and straightforward filters so that users can quickly understand where listings are located and how the available options compare.

![Airvis dashboard](docs/screenshots/dashboard.jpg)

## What it shows

- A heatmap for the city-wide distribution of listings and individual listing markers for a selected district.
- Listing counts, price range, room type, and amenity filters.
- Price distribution, room-type breakdown, and short-term rental statistics.
- A ZIP download of the source listing data and a browser Print-to-PDF option.

## Run locally

Start the React client from `frontend`:

```bash
npm ci
npm run dev
```

Open `http://127.0.0.1:5173` in a browser. The dashboard expects a compatible API at `http://127.0.0.1:8000`.

## Technical outline

The frontend uses React, TypeScript, Vite, Leaflet, and Chart.js.
