import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ArrowLeft, RefreshCw, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

interface HealthCheck {
  id: string;
  status: string;
  http_status: number | null;
  latency_ms: number | null;
  error_message: string | null;
  checked_at: string;
}

interface Incident {
  id: string;
  status: string;
  opened_at: string;
  resolved_at: string | null;
  last_alert_at: string | null;
  alert_count: number;
  consecutive_failures: number;
  last_error_message: string | null;
  last_http_status: number | null;
}

const fmt = (ts: string | null | undefined) => {
  if (!ts) return "—";
  try {
    return new Date(ts).toLocaleString("nl-BE", { timeZone: "Europe/Brussels" });
  } catch {
    return ts;
  }
};

const relTime = (ts: string | null | undefined) => {
  if (!ts) return "—";
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "zojuist";
  if (m < 60) return `${m} min geleden`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} uur geleden`;
  const d = Math.floor(h / 24);
  return `${d} dag${d > 1 ? "en" : ""} geleden`;
};

const duration = (from: string, to: string | null) => {
  const end = to ? new Date(to).getTime() : Date.now();
  const ms = end - new Date(from).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return `${h}h ${rm}m`;
};

const AdminSimpla = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/admin/login");
  }, [user, isAdmin, loading, navigate]);

  const fetchAll = useCallback(async () => {
    setRefreshing(true);
    const [c, i] = await Promise.all([
      supabase.from("simpla_health_checks").select("*").order("checked_at", { ascending: false }).limit(50),
      supabase.from("simpla_health_incidents").select("*").order("opened_at", { ascending: false }).limit(20),
    ]);
    setChecks((c.data as HealthCheck[]) || []);
    setIncidents((i.data as Incident[]) || []);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAll();
      const t = setInterval(fetchAll, 60_000);
      return () => clearInterval(t);
    }
  }, [user, isAdmin, fetchAll]);

  if (loading || !user || !isAdmin) return null;

  const latest = checks[0];
  const ok = latest?.status === "ok";
  const openIncident = incidents.find((i) => i.status === "open");

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-background border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Admin
            </Button>
          </Link>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-foreground">
            Simpla monitoring
          </h1>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={fetchAll} disabled={refreshing}>
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Vernieuwen
        </Button>
      </header>

      <div className="px-4 sm:px-6 py-6 space-y-6 max-w-6xl mx-auto">
        {/* Status hero */}
        <Card className="p-6">
          {!latest ? (
            <p className="text-muted-foreground font-body">Nog geen health checks geregistreerd.</p>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {ok ? (
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                ) : (
                  <AlertTriangle className="w-12 h-12 text-destructive" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={ok ? "default" : "destructive"} className="uppercase">
                      {ok ? "OK" : "FAIL"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      HTTP {latest.http_status ?? "—"} · {latest.latency_ms ?? "—"}ms
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Laatst gecontroleerd: {fmt(latest.checked_at)} ({relTime(latest.checked_at)})
                  </p>
                  {latest.error_message && (
                    <p className="text-sm text-destructive mt-1 max-w-xl truncate">
                      {latest.error_message}
                    </p>
                  )}
                </div>
              </div>
              <Activity className="w-8 h-8 text-muted-foreground hidden sm:block" />
            </div>
          )}
        </Card>

        {/* Open incident */}
        {openIncident && (
          <Card className="p-6 border-destructive">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="font-heading font-semibold text-destructive">Open incident</h2>
                <div className="grid sm:grid-cols-2 gap-2 mt-2 text-sm">
                  <div><span className="text-muted-foreground">Geopend:</span> {fmt(openIncident.opened_at)}</div>
                  <div><span className="text-muted-foreground">Duur:</span> {duration(openIncident.opened_at, null)}</div>
                  <div><span className="text-muted-foreground">Opeenvolgende fouten:</span> {openIncident.consecutive_failures}</div>
                  <div><span className="text-muted-foreground">Alerts verzonden:</span> {openIncident.alert_count}</div>
                </div>
                {openIncident.last_error_message && (
                  <p className="text-sm mt-2 text-destructive break-words">
                    {openIncident.last_error_message}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Recent checks */}
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-heading font-semibold">Recente checks ({checks.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tijd</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>HTTP</TableHead>
                  <TableHead>Latency</TableHead>
                  <TableHead>Foutmelding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checks.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-muted-foreground text-center py-8">Geen data</TableCell></TableRow>
                ) : checks.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="whitespace-nowrap text-sm">{fmt(c.checked_at)}</TableCell>
                    <TableCell>
                      <Badge variant={c.status === "ok" ? "default" : "destructive"}>{c.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{c.http_status ?? "—"}</TableCell>
                    <TableCell className="text-sm">{c.latency_ms ?? "—"}ms</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {c.error_message ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Recent incidents */}
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-heading font-semibold">Recente incidenten ({incidents.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Geopend</TableHead>
                  <TableHead>Opgelost</TableHead>
                  <TableHead>Duur</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Alerts</TableHead>
                  <TableHead>Laatste fout</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-muted-foreground text-center py-8">Geen incidenten</TableCell></TableRow>
                ) : incidents.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="whitespace-nowrap text-sm">{fmt(i.opened_at)}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm">{fmt(i.resolved_at)}</TableCell>
                    <TableCell className="text-sm">{duration(i.opened_at, i.resolved_at)}</TableCell>
                    <TableCell>
                      <Badge variant={i.status === "open" ? "destructive" : "secondary"}>{i.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{i.alert_count}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {i.last_error_message ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminSimpla;
