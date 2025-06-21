import XLSX from "xlsx";
import fs from "fs";
import axios from "axios";
import path from "path";
import * as cheerio from "cheerio";
import { fileURLToPath } from "url";

// Polyfill for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ETL Script to download, process and convert an Excel file from a URL into a JSON format

let filePath = "";

// Descargar el archivo Excel desde la URL si no existe
async function downloadExcel() {
    const url = "https://www.subtel.gob.cl/inicio-concesionario/servicios-de-telecomunicaciones/servicios-de-radiodifusion-sonora/";
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Buscar el enlace con el texto "Descargar archivo en formato XLS"
    const link = $("a:contains('Descargar archivo en formato XLS')").attr("href");
    if (!link) {
        throw new Error("No se encontró el enlace para descargar el archivo.");
    }

    const fileUrl = link.startsWith("http") ? link : new URL(link, url).href;
    const fileName = path.basename(fileUrl);
    filePath = path.resolve(__dirname, fileName);

    // Verificar si el archivo ya existe
    if (fs.existsSync(filePath)) {
        console.log(`✅ El archivo ya existe en: ${filePath}`);
        return filePath;
    }

    const fileResponse = await axios({
        url: fileUrl,
        method: "GET",
        responseType: "stream",
    });

    const writer = fs.createWriteStream(filePath);
    fileResponse.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on("finish", () => resolve(filePath));
        writer.on("error", reject);
    });
}

(async () => {
    try {
        const downloadedFilePath = await downloadExcel();
        console.log(`✅ Archivo descargado en: ${downloadedFilePath}`);

        // Cargar el archivo Excel
        const workbook = XLSX.readFile(downloadedFilePath);

        // Seleccionar la hoja "Listado"
        const sheetName = "Listado";
        const sheet = workbook.Sheets[sheetName];

        // Convertir la hoja en JSON
        let jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Eliminar las primeras filas innecesarias (ajustar si cambia la estructura)
        jsonData = jsonData.slice(4);

        // Renombrar columnas con nombres más claros
        const headers = [
            "Señal", "Tipo", "Cod_Reg", "Región", "Zona_Servicio", "Frecuencia",
            "Potencia", "Nombre_Radio", "Concesionaria", "RUT", "Tipo_Concesión",
            "Fecha", "Dirección_Estudio", "Comuna_Estudio", "Región_Estudio",
            "Dirección_Planta", "Comuna_Planta", "Región_Planta", "Latitud", "Longitud",
            "Datum"
        ];

        // Convertir los datos a un array de objetos
        // Convertir los datos a un array de objetos
        const cleanData = jsonData.map(row => {
            let obj = {};
            headers.forEach((header, index) => {
            if (header === "RUT" && row[index]) {
                // Convertir RUT a string con formato
                obj[header] = String(row[index]).replace(/^(\d{1,2})(\d{3})(\d{3})-?(\w{1})$/, "$1.$2.$3-$4");
            } else if (header === "Fecha" && row[index]) {
                const excelDate = row[index];
                let jsDate;

                if (typeof excelDate === 'number') {
                // Convertir fecha de Excel a JS
                jsDate = new Date((excelDate - 25569) * 86400 * 1000);
                } else if (typeof excelDate === 'string') {
                // Intentar convertir el string a una fecha
                jsDate = new Date(excelDate);
                // Verificar si la conversión fue exitosa
                if (isNaN(jsDate.getTime())) {
                    jsDate = null; // O asignar un valor por defecto
                }
                }

                obj[header] = jsDate ? jsDate.toISOString().split("T")[0] : null; // Formato YYYY-MM-DD
            } else if ((header === "Latitud" || header === "Longitud") && row[index]) {
                // Convertir coordenadas de formato GMS número 000 a formato decimal
                const gms = String(row[index]).padStart(6, "0");
                const degrees = parseInt(gms.slice(0, 2), 10);
                const minutes = parseInt(gms.slice(2, 4), 10);
                const seconds = parseInt(gms.slice(4, 6), 10);
                obj[header] = -(degrees + (minutes / 60) + (seconds / 3600)); // Negativo para el hemisferio sur y oeste
            } else {
                obj[header] = row[index] || null;
            }
            });
            return obj;
        });


        // Filtrar filas vacías
        const filteredData = cleanData.filter(row => row.Señal);

        // Guardar en un archivo JSON
        const jsonPath = "public/listado_clean.json";
        fs.writeFileSync(jsonPath, JSON.stringify(filteredData, null, 4), "utf8");

        console.log(`✅ Archivo JSON guardado en: ${jsonPath}`);
    } catch (error) {
        console.error("❌ Error al descargar o procesar el archivo:", error.message);
    }
})();
