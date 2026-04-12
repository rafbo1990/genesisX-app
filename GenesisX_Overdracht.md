# GenesisX — Overdracht & Status Document
> Laatste update: 12 april 2026

---

## SYSTEEM STATUS (12 april 2026)

| Component | Status | Workflow ID |
|-----------|--------|-------------|
| AI Brain | ✅ WERKEND (13/13 nodes) | ZVTckWDHXyLEMHcZ |
| Trading Engine | ✅ WERKEND (10/10 nodes) | fpVjglQOgxkl8M8F |
| Paper Trading | ✅ WERKEND (8/9 nodes) | WFObdsoep3Jydb3g |
| Signal flow | ✅ AI Brain → Trading Engine LIVE | — |
| GenesisX API | ✅ WERKEND | NutDYcNMHLYO8vUO |

**4 exchanges LIVE:** Bitvavo, Kraken, MEXC, MetaMask

---

## TOEGANG & CREDENTIALS

### n8n
- URL lokaal: http://localhost:5678
- URL extern: https://interparliamentary-matrilaterally-rutha.ngrok-free.dev
- Login: raf.bourziz@gmail.com / GenesisX@2026
- API key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YzIxZDEwNy1kYTAzLTRiOWUtODg3ZS1iOGNjNWU2MmE2YjciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMTU3ZDFiYWYtNzI5Mi00Mzk3LTgxMDMtMDQ2ZjQyMjZkYWVhIiwiaWF0IjoxNzc1NDM3NzU0fQ.GcTpHX-qrf-wn2BLltWopfn8rwvgxgC7LOoQ6bjvmpE`

### Docker
```bash
cd C:/GenesisX/docker
docker compose up -d        # starten
docker compose down         # stoppen
docker logs genesisX_n8n    # logs bekijken
```

---

## FIXES TOEGEPAST

### docker/docker-compose.yml
```yaml
environment:
  - N8N_RUNNERS_ENABLED=false          # Task runner uitgeschakeld (crashte cron schedules)
  - NODE_FUNCTION_ALLOW_BUILTIN=crypto,buffer,util,https,http,url,querystring
  - NODE_FUNCTION_ALLOW_EXTERNAL=*
  - N8N_BLOCK_ENV_ACCESS_IN_NODE=false
  - N8N_SECURE_COOKIE=false
```

**Waarom N8N_RUNNERS_ENABLED=false:**
De n8n task runner (JS Runner) timedde out bij Code nodes, wat leidde tot
"Task rejected: Offer expired" errors en massale cron deregistraties.
Alle scheduled workflows stopten daarna met draaien. Oplossing: runner uitschakelen.

### AI Brain (ZVTckWDHXyLEMHcZ)
- `21.2 CoinGecko Live`: HTTP node → Code node met HTTPS + EUR prijzen + fallback
- `21.4c Parse Response`: Robuuste bracket-matching JSON extractor (Claude's Dutch text brak JSON.parse)
- `21.5 Signal Processor`: Correcte variabelen, `signalPayloadStr` toegevoegd
- `21.5b Send Signals to Trading Engine`: `specifyBody: json` met directe object expressie
- `21.8 Telegram AI Report`: `process.env` vervangen door hardcoded chat ID
- `Telegram AI Brain Send`: `specifyBody: string` + `telegramBodyStr`

### Trading Engine (fpVjglQOgxkl8M8F)
- `Signal Webhook Trigger`: Nieuwe webhook node toegevoegd (path: `trading-signals`)
- `22.1 Signal Receiver`: Leest `webhookData.body.signals` (n8n wikkelt body in `.body`)
- `22.9 Telegram Trading Report`: `telegramBodyStr` pre-serialisatie
- `Telegram Trading Send`: `specifyBody: string`

### Paper Trading (WFObdsoep3Jydb3g)
- Schedule: 5 min → 15 min (`*/15 * * * *`)
- `LOG_Market_Prices` + `LOG_Trades`: Google Sheets → Code passthrough stubs
- Connectie hersteld na rename van schedule node

### GenesisX API (NutDYcNMHLYO8vUO)
- Parallel branches structuur (alle exchanges tegelijk)
- Capital Session/Balance: Code stubs (DNS `api-capital.backend.capsule.com` niet bereikbaar in Docker)
- MetaMask: Etherscan deprecated → `ethereum-rpc.publicnode.com` JSON-RPC
- Bitvavo detection: lege array = LIVE (correct gedrag bij lege account)

---

## EXCHANGE STATUS

| Exchange | Status | Actie nodig |
|----------|--------|-------------|
| Bitvavo | 🟢 LIVE | — |
| Kraken | 🟢 LIVE | — |
| MEXC | 🟢 LIVE | — |
| MetaMask (ETH) | 🟢 LIVE | — |
| OKX | 🔴 OFFLINE | Nieuwe API key aanmaken op okx.com |
| Bybit | 🔴 OFFLINE | IP whitelist verwijderen voor key `PDXOyWCOa5ygdfE4FH` |
| Capital.com | 🟡 STUB | DNS probleem in Docker — vereist alternatieve oplossing |

---

## HOE HET SYSTEEM DRAAIT

### Automatische schedules
- **AI Brain**: elke 30 min (`*/30 * * * *`) → analyseert markt via Claude → stuurt signalen naar Trading Engine
- **Trading Engine**: getriggerd via webhook `/webhook/trading-signals` door AI Brain
- **Paper Trading**: elke 15 min (`*/15 * * * *`) → fetcht CoinGecko prijzen → voert paper trades uit

### Signal flow
```
AI Brain (30 min)
  → 21.2 CoinGecko Live (EUR prijzen: BTC, ETH, SOL, XRP, ADA)
  → 21.4 Claude AI Brain (analyse + signalen)
  → 21.5 Signal Processor (botSignals object + signalPayloadStr)
  → 21.5b Send Signals to TE (POST /webhook/trading-signals)
  → Trading Engine (22.1 leest body.signals)
  → 22.4 Order Manager → 22.5 Bitvavo Executor
  → Telegram rapport
```

### Test commando's
```bash
# Trigger AI Brain handmatig
curl -s -X POST "http://localhost:5678/webhook/ai-brain-run" \
  -H "Content-Type: application/json" -d "{}"

# Check GenesisX API balances
curl -s "http://localhost:5678/webhook/genesisxapi"

# Check laatste executions
curl -s "http://localhost:5678/api/v1/executions?workflowId=ZVTckWDHXyLEMHcZ&limit=1" \
  -H "X-N8N-API-KEY: [API_KEY]"
```

---

## SCRIPTS IN C:/GenesisX/

| Script | Doel |
|--------|------|
| `test_signal_flow.js` | End-to-end AI Brain → Trading Engine test |
| `check_exec_detail.js [id]` | Details van een specifieke execution |
| `check_pt.js` | Status alle 3 workflows |
| `diagnose_pt.js` | Paper Trading diagnose |
| `fix_claude_parser.js` | Herstel Claude JSON parser |
| `fix_22_1_receiver.js` | Herstel Signal Receiver |
| `update_api_keys.js` | Update exchange API keys in n8n |

---

## OPENSTAANDE PUNTEN

1. **Bybit** — Verwijder IP whitelist voor API key `PDXOyWCOa5ygdfE4FH` via bybit.com → API Management
2. **OKX** — Maak nieuwe API key aan op okx.com en update `.env` + n8n workflow
3. **Capital.com** — DNS `api-capital.backend.capsule.com` niet bereikbaar vanuit Docker container
4. **Google Sheets** — OAuth2 niet geconfigureerd; Paper Trading logging werkt via Code stubs
5. **Volgende fase** — Fase 25 (Sentimentanalyse) of Fase 26 (Telegram Knoppen Control)

---

## GITHUB REPOS

- Hoofdrepo: https://github.com/rafbo1990/GenesisX (of rafbo1990/genesisX)
- App repo: https://github.com/rafbo1990/genesisX-app (PWA)

```bash
# Push
cd C:/GenesisX
git add docs/genesisx_master_blueprint.md GenesisX_Overdracht.md
git commit -m "Status update 12 april 2026 - core systeem live"
git push
```
