# Radios FM/AM de Chile 📻

A public and interactive database of FM/AM radio concessions in Chile. This project visualizes radio station information by zone, frequency, and type, enabling easy search and exploration of licensed broadcast services.

## 🌐 Demo

Access the live project at: [radios.palminio.cl](https://radios.palminio.cl)

## 📦 Features

- 🔍 Real-time search by station name, frequency, and service zone.
- 🗺️ Interactive map with coordinates for each station.
- 📊 Cleaned and filtered data sourced from SUBTEL Chile.
- 🧪 ETL pipeline to extract, transform and output structured JSON from official Excel sources.
- ⚙️ Automatically deployed via GitHub Actions and GitHub Pages.

## 📁 Project Structure

```

radios.palminio/
├── etl/                  # ETL scripts (e.g., script.js)
├── src/
│   ├── assets/           # Frontend source assets copied into public/ at build time
│   └── templates/        # HTML template used to generate the site
├── public/               # Build output (generated, not tracked)
├── .github/workflows/    # CI/CD workflow for GitHub Pages
├── package.json          # Project metadata and scripts

```

## 🔧 Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install Dependencies

```bash
npm install
```

### Run the ETL Script

```bash
npm run etl
```

This will process the Excel source and generate `generated/listado_clean.json` plus the build metadata used to stamp the generated HTML.

### Build the Site

```bash
npm run build
```

This reads the HTML template from `src/templates/index.template.html`, copies the frontend assets from `src/assets/` into `public/`, and generates `public/index.html` with the current update label.

### Clean Output Files

```bash
npm run clean
```

## 🚀 Deployment

The site is automatically deployed via [GitHub Pages](https://pages.github.com/) using GitHub Actions. The workflow runs the ETL step, builds the HTML, and then publishes the `public/` directory. See `.github/workflows/main.yml` for the workflow definition.

## 📊 Data Source

* [SUBTEL - Servicios de Radiodifusión Sonora](https://www.subtel.gob.cl/inicio-concesionario/servicios-de-telecomunicaciones/servicios-de-radiodifusion-sonora/)

## 👨‍💻 Author

**Lucas Palminio**
[palminio.cl](https://palminio.cl)

### 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.



