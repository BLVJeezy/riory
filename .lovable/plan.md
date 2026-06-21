## Probleem

De preview toont een wit scherm omdat `src/pages/Admin.tsx` een JSX-syntaxfout heeft. SWC faalt met "Unexpected token" op regel 657 (`})()`). Vite kan daardoor de hele app-bundle niet bouwen, dus elke pagina (ook `/`) blijft leeg.

## Oorzaak

Binnen de IIFE die het "Sources"-tabblad rendert (start regel 405, return op 416) ontbreekt één afsluitende `</div>`.

Open-divs in de return:
- 417 `<div class="space-y-6">` — buitenste wrapper A
- 459 `<div ref={sourcesReportRef} class="space-y-6">` — wrapper E rond beide kaarten

Afsluitende divs aan het einde:
- 654 sluit de "Afspraken"-kaart
- 655 sluit wrapper E

Wrapper A wordt nooit gesloten, waardoor SWC bij `})()` op 657 vastloopt.

## Fix

Voeg één `</div>` toe tussen regel 655 en regel 656 om wrapper A te sluiten:

```
              </div>   // close E (sourcesReportRef)
            </div>     // NEW — close A (space-y-6 op 417)
          );
        })()
```

Geen andere wijzigingen. Daarna laadt de preview opnieuw en is de witte pagina weg.