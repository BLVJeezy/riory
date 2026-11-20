# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
## Beheerpagina (`/beheer.html`)

Klantbeheer voor teksten en foto's (Solyn Global), zonder server of database. Zelfde werkwijze als bij Nuance.

- Openen: `/beheer.html`, toegangscode = de naam van de klant in kleine letters (`noindex`).
- Klant kiest een pagina, tikt op een tekst en typt; foto's vervangen via het tabblad Foto's. Met de knop "Klikken" werkt de site weer gewoon (taal wisselen, menu openen, doorklikken). Werkt als app op telefoon (manifest + service worker, enkel voor `/beheer`).
- Wijzigingen blijven op het toestel van de klant. Met "Versturen" komt een bestand `riory-wijzigingen.txt` binnen via WhatsApp/mail.
- Online zetten: nakijken en de inhoud als `public/site-content.js` in de repo zetten. `site-edit.js` past die toe op elke pagina (ook na React-renders). Leeg bestand = site zoals gebouwd.
- Teksten zijn gekoppeld aan hun oorspronkelijke tekst, foto's aan hun oorspronkelijke bestand. Wordt die bron later in de code veranderd, dan vervalt de oude aanpassing.
- Achtergrondafbeeldingen in CSS en video's zijn niet via het beheer aan te passen.

### Publiceren en opmerkingen (sinds 20 nov 2026)

- De klant publiceert zelf met **Publiceer op de website** in het beheer. Foto's en teksten gaan via de Solyn Operations Center (`ops-hub-charm` → `/api/public/beheer`, Supabase: tabellen `beheer_content`/`beheer_versions`, foto's in de openbare map `beheer/<site>/`). De site laadt de gepubliceerde versie via `/api/beheer?a=content&site=<site>` (cache ±20 s). Eerdere versies zijn terug te zetten in het tabblad Publiceren.
- **Probleem of opmerking**: knop bovenaan het beheer. De klant kiest "Er werkt iets niet" of "Vraag of opmerking", kan een screenshot van de pagina maken (`beheer-shot.js` = html2canvas 1.4.1, MIT) of zelf foto's toevoegen. Het gaat naar het Solyn Operations Center (`/api/public/request` met de aanvraaglink van de klant): aanvraag + taak + mail naar Jason. Zonder aanvraaglink of bij een fout: WhatsApp- en mailknop.
- Toegangscode: de gewone naam (zie boven); alleen de sha256 staat in de code.
