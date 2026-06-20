# KKOO Buyer Web

Vue 3 + Vite buyer experience: landing, marketplace, eats, groceries, send (buy-for-me), ride.

Rides use the same backend as the Flutter buyer app: place search, fare quote, create ride, live tracking on `/rides/:id`. Service cities load from `GET /logistics/markets/` — see [PHASE2_AND_MARKETS.md](../kkoo-buyers-app/docs/PHASE2_AND_MARKETS.md).

| Environment | URL |
|-------------|-----|
| Staging / production | `https://kkooapp.co.tz` and `https://www.kkooapp.co.tz` |
| API | `https://api.kkooapp.co.tz/api/v1` |

## Routes (canonical)

| Path | Vertical |
|------|----------|
| `/` | Landing |
| `/marketplace` | Shop / marketplace |
| `/eats` | Food delivery |
| `/grocery` | Groceries |
| `/send` | Buy-for-me / proxy shopping |
| `/ride` | Rides |

Legacy `/web/*` paths redirect to the routes above.

## Local dev

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Deploy (staging)

Push to `main` → GitHub Actions SSH deploy:

- `DO_APP_DIR=/home/sammy/kkoo-buyer-web`
- `DO_WEB_DIR=/var/www/www`
