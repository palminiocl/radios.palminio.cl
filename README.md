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
├── public/               # Static files for frontend (HTML, CSS, JSON)
│   ├── index.html
│   ├── style.css
│   └── listado\_clean.json
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

This will process the Excel source and generate `public/listado_clean.json`.

### Clean Output Files

```bash
npm run clean
```

## 🚀 Deployment

The site is automatically deployed via [GitHub Pages](https://pages.github.com/) using GitHub Actions. See `.github/workflows/main.yml` for the workflow definition.

## 📊 Data Source

* [SUBTEL - Servicios de Radiodifusión Sonora](https://www.subtel.gob.cl/inicio-concesionario/servicios-de-telecomunicaciones/servicios-de-radiodifusion-sonora/)

## 👨‍💻 Author

**Lucas Palminio**
[palminio.cl](https://palminio.cl)

### 📄 License

This project is currently **not licensed** for public use beyond viewing and personal exploration.

> ⚠️ **License Pending:**
> The licensing terms for this project are still under review. Until a formal license is defined, **any redistribution, modification, or commercial use is not permitted**. Please contact the author if you wish to reuse or collaborate.




