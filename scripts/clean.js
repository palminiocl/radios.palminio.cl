import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

function removePath(targetPath) {
    if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath, { recursive: true, force: true });
        console.log(`🧹 Eliminado: ${targetPath}`);
    }
}

removePath(path.join(projectRoot, "public"));
removePath(path.join(projectRoot, "generated"));

const etlDir = path.join(projectRoot, "etl");
if (fs.existsSync(etlDir)) {
    for (const entry of fs.readdirSync(etlDir)) {
        if (entry.toLowerCase().endsWith(".xlsx")) {
            removePath(path.join(etlDir, entry));
        }
    }
}