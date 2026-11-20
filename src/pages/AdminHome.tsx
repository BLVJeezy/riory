import { useEffect, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  LogOut,
  PencilRuler,
  Workflow,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const WERKBONNEN_URL = "https://werkbonnenriory.lovable.app";
const SITE_EDIT_URL =
  "https://lovable.dev/projects/fceb5b30-e96a-46b0-ae0a-82023f8526e8";

type Tegel = {
  titel: string;
  uitleg: string;
  icon: typeof BarChart3;
  kleur: string;
  to?: string;
  href?: string;
};

const TEGELS: Tegel[] = [
  {
    titel: "Statistieken",
    uitleg: "Afspraken, bronnen, regio's en websitecijfers",
    icon: BarChart3,
    kleur: "bg-primary text-primary-foreground",
    to: "/admin/statistieken",
  },
  {
    titel: "Werkbonnen",
    uitleg: "Werkbonnen, foto's en opvolging van interventies",
    icon: ClipboardList,
    kleur: "bg-emerald-600 text-white",
    href: WERKBONNEN_URL,
  },
  {
    titel: "Site edit",
    uitleg: "Teksten, pagina's en foto's van riory.be aanpassen",
    icon: PencilRuler,
    kleur: "bg-[#1B2A4A] text-white",
    href: SITE_EDIT_URL,
  },
];

const tegelCls =
  "group flex items-center gap-4 rounded-2xl bg-background border border-border p-4 sm:p-5 " +
  "shadow-sm transition-[transform,box-shadow] duration-100 ease-out " +
  "hover:shadow-md active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "motion-reduce:transition-none motion-reduce:active:scale-100";

const TegelLink = ({ t, children }: { t: Tegel; children: ReactNode }) =>
  t.to ? (
    <Link to={t.to} className={tegelCls}>
      {children}
    </Link>
  ) : (
    <a
      href={t.href}
      target="_blank"
      rel="noopener noreferrer"
      className={tegelCls}
    >
      {children}
    </a>
  );

const AdminHome = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/admin/login");
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <p className="text-muted-foreground font-body">Laden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto w-full max-w-xl px-4 sm:px-6 pt-10 sm:pt-16 pb-10">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <img src="/riory-logo.svg" alt="Riory" className="h-8 w-auto" />
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-background active:scale-[0.97] transition"
              aria-label="Uitloggen"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Uitloggen</span>
            </button>
          </div>
          <div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground leading-tight tracking-[-0.02em]">
                Riory Admin
              </h1>
              <p className="text-sm text-muted-foreground font-body">
                Kies waar je naartoe wil
              </p>
            </div>
          </div>
        </header>

        <nav className="flex flex-col gap-3" aria-label="Admin onderdelen">
          {TEGELS.map((t) => {
            const Icon = t.icon;
            return (
              <TegelLink key={t.titel} t={t}>
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${t.kleur}`}
                >
                  <Icon className="w-7 h-7" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading font-bold text-lg text-foreground">
                    {t.titel}
                  </span>
                  <span className="block text-sm text-muted-foreground font-body">
                    {t.uitleg}
                  </span>
                </span>
                {t.href ? (
                  <ExternalLink className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5" />
                )}
              </TegelLink>
            );
          })}
        </nav>

        <Link
          to="/admin/werkingsproces"
          className="mt-6 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-body text-muted-foreground hover:text-foreground hover:bg-background active:scale-[0.97] transition"
        >
          <Workflow className="w-4 h-4" />
          Werkingsproces bekijken
        </Link>
      </div>
    </div>
  );
};

export default AdminHome;
