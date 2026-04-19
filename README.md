# Ekici EMS - Energistyringssystem

Et personligt energistyringsdashboard for prosolenergi.dk bygget med Next.js 14, TypeScript, Tailwind CSS og Supabase.

## Funktioner

- **Forside**: Oversigt over energiforbrug og produktion med sammenligning til tidligere periode
- **El**: Detaljeret analyse af elektricitetsforbrug og produktion fra eloverblik.dk API
- **Vand**: Vandforbrugsoversigt med mulighed for at importere data fra Excel/CSV
- **Varme**: Varmepumpeforbrug med CSV-import og AI-assisteret parsing
- **Solceller**: Solcelleproduktion, batteriladning og eksport/import til elnet
- **Rapport**: Generer rapporter for valgt periode og energityper med PDF-download
- **Brugere** (admin kun): Administrer brugere, roller og adgange

## Tech Stack

- **Frontend**: Next.js 14 med App Router
- **Styling**: Tailwind CSS
- **Diagrammer**: Recharts
- **Ikoner**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Autentificering**: Supabase Auth
- **Sikkerhed**: Row Level Security (RLS)
- **Parsing**: XLSX (Excel), CSV

## Installation

### 1. Klon projektet

```bash
git clone <repository-url>
cd ems-dashboard
```

### 2. Installer dependencies

```bash
npm install
```

### 3. Opsæt miljøvariabler

Opret en `.env.local` fil i projektets rod:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# External APIs
ELOVERBLIK_API_TOKEN=your_eloverblik_token_here
```

### 4. Opsæt Supabase

1. Opret en Supabase-projekt på [supabase.com](https://supabase.com)
2. Kør SQL-migrationen fra `supabase/migrations/001_initial_schema.sql` i Supabase SQL Editor
3. Kopier din Supabase URL og Anon Key til `.env.local`

### 5. Start udviklings-serveren

```bash
npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000) i din browser.

## Konfiguration af API'er

### eloverblik.dk API

For at tilslutte eloverblik.dk API:

1. Registrer dig på [eloverblik.dk](https://eloverblik.dk)
2. Få dit API-token
3. Tilføj det til `.env.local` som `ELOVERBLIK_API_TOKEN`
4. Implementer API-kaldet i `app/(dashboard)/el/page.tsx` og `app/(dashboard)/solceller/page.tsx`

Se TODO-kommentarer i koden for hvor API-integrationerne skal implementeres.

## Brugerroller

- **Admin**: Fuld adgang til alle funktioner, kan importere data og administrere brugere
- **Guest**: Kan kun se data, ingen import eller brugeradministration

## Databaseskema

### Tabeller

- **profiles**: Brugerinformation og roller
- **electricity_readings**: Daglige elektricitetsmålinger
- **water_readings**: Månedlige vandforbrugsmålinger
- **heat_readings**: Månedlige varmepumpemålinger
- **solar_readings**: Daglige solcellemålinger

Alle tabeller har Row Level Security aktiveret, så brugere kun kan se deres egne data.

## Struktur

```
app/
  login/                    # Login-side
  (dashboard)/
    layout.tsx             # Dashboard layout med sidebar og topbar
    page.tsx               # Forside (oversigt)
    el/page.tsx            # El-side
    vand/page.tsx          # Vand-side
    varme/page.tsx         # Varme-side
    solceller/page.tsx     # Solceller-side
    rapport/page.tsx       # Rapport-side
    brugere/page.tsx       # Brugere-side (admin kun)

components/
  layout/
    Sidebar.tsx            # Venstre navigationsmenu
    TopBar.tsx             # Top bar med brugerinfo
  vand/
    ImportModal.tsx        # Modal for vanddata-import
  varme/
    ImportModal.tsx        # Modal for varmedata-import
  brugere/
    UserTable.tsx          # Brugertabel
    AddUserModal.tsx       # Modal for tilføjelse af bruger

lib/
  supabase.ts             # Supabase-klient
  mock-data.ts            # Mock-data til udvikling

types/
  database.ts             # TypeScript-typer for database

supabase/
  migrations/
    001_initial_schema.sql # Database-skema
```

## Styling

Appen bruger en dyb lilla mørk tema:

- **Baggrund**: `#1a0a2e` (dyb lilla)
- **Sidebar**: `#2d1b4e` (mørkere lilla)
- **Kort**: Hvide kort med `rounded-2xl` og skygge
- **Tekst**: Hvid på mørk baggrund, grå på hvid baggrund

## Mobilresponsivitet

- Sidebar kollapses på mobile enheder
- Kort stables vertikalt
- Tabeller bliver horisontalt scrollbare på små skærme

## TODO-elementer

Følgende elementer skal implementeres:

1. **Supabase Auth**: Tilslut login-siden til Supabase Authentication
2. **eloverblik.dk API**: Implementer API-integration for el- og solcelledata
3. **Excel/CSV Parsing**: Implementer fil-parsing for vand- og varmedata-import
4. **PDF-generering**: Implementer PDF-download for rapporter
5. **Brugeradministration**: Tilslut bruger-CRUD-operationer til Supabase
6. **Middleware**: Implementer auth-middleware for at beskytte dashboard-sider

Se `TODO`-kommentarer i koden for specifikke implementeringssteder.

## Udvikling

### Tilføj nye sider

1. Opret en ny mappe under `app/(dashboard)/`
2. Opret `page.tsx` med din side-komponent
3. Siden vil automatisk blive tilgængelig via URL'en

### Tilføj nye komponenter

1. Opret komponenten under `components/`
2. Importer den i dine sider

### Tilføj mock-data

Tilføj nye mock-data til `lib/mock-data.ts` og importer dem i dine sider.

## Deployment

Appen kan deployes til Vercel, Netlify eller enhver anden Next.js-hosting:

```bash
npm run build
npm start
```

Sørg for at sætte miljøvariabler på din hosting-platform.

## Licens

Proprietary - Ekici EMS

## Support

For support, kontakt: support@prosolenergi.dk
