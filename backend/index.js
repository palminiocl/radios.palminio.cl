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

// Busqueda por nombre
app.get('/radios/search', (req,res) =>{
    const query = req.query.q?.toLowerCase();
    if(!query) return res.json(radios);

    const result = radios.filter( r => 
        r["Nombre_Radio"]?.toLowerCase().includes(query)
    );
    res.json(result);
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    
})