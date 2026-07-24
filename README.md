# Araujo Farms — Fazenda Nova Campinas

A clean, bilingual (English / Portuguese) website for **Araujo Farms** (Fazenda Nova Campinas),
a 1,340-hectare cattle and Cerrado property on the Rio Garças in Tesouro, Mato Grosso, Brazil.

Built as a single-page site served by a tiny Node/Express server — ready for Railway,
Render, Fly.io, or any Node host.

## Run it locally

```bash
npm install
npm start
# open http://localhost:3000
```

## What's inside

```
public/
  index.html          # the whole site (HTML + CSS + JS, one file)
  media/photos/       # 16 curated, web-optimized photos
  media/videos/       # 4 videos + poster frames
server.js             # Express static server (reads process.env.PORT)
package.json
```

The language toggle (EN / PT) lives in the top-right nav. All copy is stored in one
`I18N` dictionary near the bottom of `index.html` — edit English and Portuguese side by side.

## Things to personalize (marked with ✎ on the site)

- **The People** section — placeholder names, roles, bios, and photo slots. Replace with the
  real family/team details and headshots.
- **Raising Cattle** — add herd details (breed, e.g. Nelore; head count; how you run it).
- **Contact** — real email and phone (currently placeholders).

## Deploy to Railway

1. Push this folder to a GitHub repo.
2. In Railway: **New Project → Deploy from GitHub repo** → pick the repo.
3. Railway auto-detects Node and runs `npm start`. It sets `PORT` automatically.
4. In the service's **Networking** settings, click **Generate Domain** for a public URL.

No environment variables are required.

## Facts used on the site (from the property documents)

- 1,340 ha total · 1,047 ha preserved native Cerrado · 469 ha legal reserve
- 4 km frontage on the Rio Garças · 3.5 km frontage on the paved MT-110
- Clay soils (190–315 g/kg) · flat, fully mechanizable, no erosion
- Sede 110 m² · auxiliary house 80 m² · external suite 40 m² · warehouse 180 m² with lodging
- Three-phase power · artesian well 5,000 L/h · internet · fully fenced
- 5 km from Tesouro · 35 km from Guiratinga · 145 km from Rondonópolis
- Coordinates: 16°08′16″S, 53°36′02″W · CAR MT226590/2022

Private data (owner name, CPF/CNPJ) from the documents was intentionally kept **off** the public site.
