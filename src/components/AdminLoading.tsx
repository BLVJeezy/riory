import { useEffect, useState } from "react";

/** Laadscherm voor admin-pagina's met een uitweg als de sessie blijft hangen. */
const AdminLoading = () => {
  const [traag, setTraag] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTraag(true), 10000);
    return () => clearTimeout(t);
  }, []);

  const opnieuw = () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("sb-") && k.includes("auth-token"))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      /* storage geblokkeerd: gewoon doorverwijzen */
    }
    window.location.replace("/admin/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-muted px-6 text-center">
      <p className="text-muted-foreground font-body">Laden...</p>
      {traag && (
        <>
          <p className="text-sm text-muted-foreground max-w-xs">Duurt het te lang? Je sessie is mogelijk vastgelopen.</p>
          <button
            type="button"
            onClick={opnieuw}
            className="h-10 px-5 rounded-md bg-primary text-primary-foreground font-heading font-semibold text-sm"
          >
            Opnieuw inloggen
          </button>
        </>
      )}
    </div>
  );
};

export default AdminLoading;
