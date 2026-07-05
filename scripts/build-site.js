import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const templatePath = path.join(projectRoot, "src", "templates", "index.template.html");
const outputPath = path.join(projectRoot, "public", "index.html");
const staticSourceDir = path.join(projectRoot, "src", "assets");
const metadataPath = path.join(projectRoot, "generated", "build-metadata.json");
const dataPath = path.join(projectRoot, "generated", "listado_clean.json");
const publicDir = path.join(projectRoot, "public");

function formatUpdateLabel(date) {
    const formatted = new Intl.DateTimeFormat("es-CL", {
        month: "long",
        year: "numeric",
    }).format(date);

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function getLastUpdatedLabel() {
    if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

        if (typeof metadata.lastUpdated === "string" && metadata.lastUpdated.trim()) {
            return metadata.lastUpdated;
        }
    }

    return formatUpdateLabel(new Date());
}

const template = fs.readFileSync(templatePath, "utf8");
const lastUpdated = getLastUpdatedLabel();
const output = template.replace(/\{\{LAST_UPDATE\}\}/g, lastUpdated);

if (output.includes("{{LAST_UPDATE}}")) {
    throw new Error("El template de index.html todavía tiene placeholders sin reemplazar.");
}

fs.rmSync(publicDir, { recursive: true, force: true });
fs.mkdirSync(publicDir, { recursive: true });

if (fs.existsSync(staticSourceDir)) {
    fs.cpSync(staticSourceDir, publicDir, { recursive: true });
}

if (fs.existsSync(dataPath)) {
    fs.copyFileSync(dataPath, path.join(publicDir, "listado_clean.json"));
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output, "utf8");

console.log(`✅ HTML generado en: ${outputPath}`);
console.log(`✅ Última actualización usada: ${lastUpdated}`);
console.log(`✅ Assets estáticos copiados desde: ${staticSourceDir}`);
console.log(`✅ Datos copiados desde: ${dataPath}`);