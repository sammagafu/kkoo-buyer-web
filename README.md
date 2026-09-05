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

Dev server proxies `/api` → **`http://localhost:8000`**.  
See [../docs/CROSS_APP_INTEGRATION.md](../docs/CROSS_APP_INTEGRATION.md).

## Deploy (production)

Push to `main` → CI (test + build + e2e) → SSH deploy that:

1. `git pull` in `/home/sammy/kkoo-buyer`
2. `docker compose -f docker-compose.prod.yml up -d --build web-buyer` from `/home/sammy/kkooapp-backend-fiber`

Host nginx terminates TLS and proxies `kkooapp.co.tz` → `127.0.0.1:5175` (buyer container).

**GitHub Actions secrets** (Settings → Secrets → Actions):

| Secret | Required | Default / example |
|--------|----------|-------------------|
| `DO_HOST` | yes | `kkooapp.co.tz` |
| `DO_USER` | yes | `sammy` |
| `DO_SSH_KEY` | yes | private key PEM for `sammy` |
| `DO_BUYER_DIR` | no | `/home/sammy/kkoo-buyer` |
| `DO_COMPOSE_DIR` | no | `/home/sammy/kkooapp-backend-fiber` |

Do **not** set `DO_WEB_DIR` — production does not rsync to host nginx docroots.

Manual redeploy: **Actions → Deploy Buyer Web (manual) → Run workflow**.
