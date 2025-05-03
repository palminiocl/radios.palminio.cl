const XLSX = require("xlsx");
const fs = require("fs");

// Cargar el archivo Excel
const filePath = "Actualiza_Febrero_2025_web.xlsx";
const workbook = XLSX.readFile(filePath);

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
const cleanData = jsonData.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
        obj[header] = header === "RUT" ? String(row[index] || "") : row[index] || null; // Convertir RUT a string
    });
    return obj;
});

// Filtrar filas vacías
const filteredData = cleanData.filter(row => row.Señal);

// Guardar en un archivo JSON
const jsonPath = "listado_clean.json";
fs.writeFileSync(jsonPath, JSON.stringify(filteredData, null, 4), "utf8");

console.log(`✅ Archivo JSON guardado en: ${jsonPath}`);
