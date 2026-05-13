# Plan: Sync-knop voor analytics

## Belangrijke beperking vooraf

Lovable Analytics heeft **geen publieke API**. De app kan dus technisch niet inloggen op Lovable's analytics-systeem en daar data ophalen — dat kan alleen ik (de agent) via een interne tool, en dat gebeurt niet automatisch wanneer een bezoeker op een knop klikt.

**Wat wél kan:** de site verzamelt al elke pageview zelf in de `page_views` tabel (met `visitor_id`, `referrer`, `user_agent`, `page`, `created_at`). Dit is dezelfde ruwe data die Lovable Analytics ook ziet. Met een sync-knop kunnen we die ruwe data aggregeren in **exact dezelfde layout als Lovable Analytics**, zodat het visueel identiek aanvoelt.

## Wat de sync-knop doet

1. Owner klikt **"Sync nu"** in admin → analytics tab
2. Edge function `sync-analytics` draait:
   - Leest `page_views` van de laatste X dagen (selecteerbaar: 7/30/90/365)
   - Aggregeert: pageviews, unique visitors, top pages, sources, devices, browsers, countries (via IP→country lookup), per dag
   - Schrijft één rij per dag in `analytics_snapshots` (upsert op `snapshot_date`)
3. UI ververst en toont de snapshots in **Lovable Analytics stijl**:
   - KPI cards (Pageviews, Visitors, Bounce rate, Avg duration)
   - Lijngrafiek pageviews + visitors over tijd
   - Top pages bar chart
   - Sources (referrers) bar chart
   - Devices pie chart (Desktop/Mobile/Tablet)
   - Countries lijst met vlaggen
4. Laatste sync-tijd wordt getoond ("Laatst gesynct: 2 min geleden")

## Wat identiek wordt aan Lovable Analytics

| Lovable Analytics toont | Wij tonen | Bron |
|---|---|---|
| Pageviews per dag | ✅ Identiek | `page_views` count |
| Unique visitors | ✅ Identiek | distinct `visitor_id` |
| Top pages | ✅ Identiek | group by `page` |
| Top sources | ✅ Identiek | parsed `referrer` |
| Devices | ✅ Identiek | parsed `user_agent` |
| Browsers | ✅ Identiek | parsed `user_agent` |
| Countries | ⚠️ Benadering | via IP geolocatie edge function (niet 100% match) |
| Avg session duration | ❌ Niet beschikbaar | wij meten geen sessieduur |
| Bounce rate | ⚠️ Proxy | sessies met 1 pageview / totaal |

Voor exacte 1-op-1 match met avg duration en bounce rate moet de tracking uitgebreid worden (extra event bij page leave). Wil je dat ik dat ook bouw?

## Technisch

**Nieuwe edge function:** `supabase/functions/sync-analytics/index.ts`
- Vereist admin (JWT + has_role check)
- Parameter: `days` (default 30)
- Aggregeert `page_views` → upsert in `analytics_snapshots`

**UI wijziging:** `src/components/admin/AnalyticsTab.tsx`
- "Sync nu" knop bovenaan
- Layout herwerken naar Lovable Analytics-stijl (KPI rij, line chart, bar charts, pie, country list)
- Date range selector (7/30/90/365 dagen)
- Toont "Laatst gesynct: ..." op basis van max(`updated_at`) in `analytics_snapshots`

**Optioneel:** `supabase/functions/lookup-country/index.ts` — IP→country via gratis API (ipapi.co) tijdens sync.

## Vragen voor je akkoord

1. Akkoord dat we **eigen page_views data** aggregeren (i.p.v. Lovable Analytics zelf, wat technisch onmogelijk is)?
2. Country tracking erbij via IP lookup tijdens sync? (gratis tier ~30k req/maand)
3. Extra tracking voor exacte bounce rate + avg duration?
