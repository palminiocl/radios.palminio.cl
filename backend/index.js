import express from 'express';
import cors from 'cors';
import { readFile } from 'fs/promises';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const radios = JSON.parse(
    await readFile(new URL('./listado_radios.json', import.meta.url))
);

// Lista completa de radios
app.get('/radios', (req,res) => {
    res.json(radios);
})

// Busqueda por nombre, frecuencia y/o zona de servicio
app.get('/radios/search', (req,res) =>{
    const query = req.query.q?.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').split(' ');
    const results = radios.filter(item =>
        query.every(term =>
            (item.Nombre_Radio && item.Nombre_Radio.toLowerCase().includes(term)) ||
            (item.Frecuencia && item.Frecuencia.toString().toLowerCase().includes(term)) ||
            (item.Zona_Servicio && item.Zona_Servicio.toLowerCase().includes(term))
        )
    );
    if(!query) return res.json(radios);

    res.json(results);
})


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    
})