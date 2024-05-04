import express from 'express';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

///// ruta para crear un archivo
app.get('/crear', (req, res) => {

    const { archivo,contenido } = req.query

    /// fecha actual para agrega al archivo en formato dd/mm/yyyy
    const fecha = new Date();
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    fs.writeFile(`${archivo}.txt`, `${fechaFormateada}: ${contenido}`,'utf8',()=>{
        console.log(`archivo creado`)
        res.send('¡ARCHIVO CREADO CON ÉXITO!');
    })
});


///// ruta leer crear un archivo
app.get('/leer', (req, res) => {

    const { archivo } = req.query

    fs.readFile(`${archivo}.txt`,'utf8',(err,data)=>{
        if (err) {
            console.log(err);
            res.send(`ARCHIVO NO ENCOMTRADO: ${archivo}.txt`);
        } else {
            res.send(`<strong>El nombre del archivo es:</strong> ${archivo}.txt <br> <strong>Fecha de Creación/Contenido es:</strong> ${data}`);
        }
    })
});


///// ruta leer renombrar un archivo
app.get('/renombrar', (req, res) => {

    const { nombre,nuevoNombre } = req.query

    fs.rename(`${nombre}.txt`, `${nuevoNombre}.txt`, (err) => {
        if (err) {
            console.log(err);
            return res.send('ERROR AL RENOMBRAR EL ARCHIVO');
        }

        res.send(`<strong>Archivo Actual es:</strong> ${nombre}.txt <br> <strong>Archivo Nuevo:</strong> ${nuevoNombre}.txt`);
    })
});


///// ruta para eliminar un archivo
app.get('/eliminar', (req, res) => {
    const { archivo } = req.query;

    fs.unlink(`${archivo}.txt`, (err) => {
        if (err) {
            console.log(err);
            return res.send(`ERROR AL ELIMINAR EL ARCHIVO: ${archivo}.txt`);
        }
        console.log('ARCHIVO ELIMINADO');
        res.send(`<strong>El Archivo:</strong> ${archivo}.txt <strong>fue eliminado</strong>`);
    });
});

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
