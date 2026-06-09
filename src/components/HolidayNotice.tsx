import { CalendarDays, X } from "lucide-react";
import { useState } from "react";

const VERLOF_START_MAAND = 6; // juli = 6 (0-indexed)
const VERLOF_START_DAG = 2;
const VERLOF_EINDE_MAAND = 6;
const VERLOF_EINDE_DAG = 19;
const SHOW_VANAF_DAGEN = 14; // toon 14 dagen voor verlofstart

const HolidayNotice = () => {
  const [gesloten, setGesloten] = useState(false);

  const nu = new Date();
  const jaar = nu.getFullYear();
  const verlofStart = new Date(jaar, VERLOF_START_MAAND, VERLOF_START_DAG);
  const verlofEinde = new Date(jaar, VERLOF_EINDE_MAAND, VERLOF_EINDE_DAG, 23, 59);
  const toonVanaf = new Date(verlofStart);
  toonVanaf.setDate(toonVanaf.getDate() - SHOW_VANAF_DAGEN);

  const isZichtbaar = nu >= toonVanaf && nu <= verlofEinde;
  const isOpVerlof = nu >= verlofStart && nu <= verlofEinde;

  if (!isZichtbaar || gesloten) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20">
      <div className="section-container px-6 md:px-8 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-sm">
          <CalendarDays className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-foreground/80 font-body">
            {isOpVerlof ? (
              <>
                Riory is momenteel{" "}
                <span className="font-semibold text-foreground">met jaarlijks verlof t.e.m. 19 juli</span>
                {" "}— dringende oproepen worden doorgeschakeld.
              </>
            ) : (
              <>
                Riory is{" "}
                <span className="font-semibold text-foreground">met jaarlijks verlof van 2 t.e.m. 19 juli</span>
                {" "}— plan uw afspraak tijdig in.
              </>
            )}
          </span>
        </div>
        <button
          onClick={() => setGesloten(true)}
          aria-label="Sluiten"
          className="text-foreground/40 hover:text-foreground transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default HolidayNotice;
