## Simpla Monitoring Page

Add an admin-only page at `/admin/simpla` that shows the current health of the Simpla callback integration.

### What it shows

1. **Status hero card** — big OK / FAIL badge based on latest `simpla_health_checks` row, with HTTP status, latency, and "Last checked X minutes ago".
2. **Open incident banner** (only if one is open) — opened-at, consecutive failures, last error, alert count.
3. **Recent checks table** — last 50 rows from `simpla_health_checks` (time, status, HTTP, latency, error).
4. **Recent incidents table** — last 20 rows from `simpla_health_incidents` (opened, resolved, duration, alert count, last error).
5. **Refresh button** — re-fetches both tables (auto-refresh every 60s).

### Where it lives

- New route `/admin/simpla` in `src/App.tsx`, guarded the same way as `/admin` (admin role check via `useAuth` + `has_role`).
- Add a link "Simpla monitoring" in the existing Admin dashboard (`src/pages/Admin.tsx`) so it's discoverable.

### Technical notes

- New file `src/pages/AdminSimpla.tsx`.
- Data fetched client-side via the Supabase JS client; existing RLS already allows admins to read both `simpla_health_checks` and `simpla_health_incidents`, so no DB migration is needed.
- Pure presentation: Tailwind + existing shadcn `Card`, `Badge`, `Table`, `Button` components. No new dependencies.
- Use semantic tokens from `index.css` (success/destructive/muted) — no hardcoded colors.
- Times formatted in `nl-BE` Europe/Brussels, matching the alert email convention.
- No changes to the health-check edge function or any business logic.
