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


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    
})