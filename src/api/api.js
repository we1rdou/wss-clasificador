// API routes and controllers
const express = require('express');
const router = express.Router();
const fs = require('fs');
const config = require('../config/config');

// Example route
router.get('/example', (req, res) => {
    res.send('API example route');
});

// Ruta para obtener el historial
router.get('/historial', (req, res) => {
    try {
        const historial = fs.readFileSync('historial.json', 'utf-8').split('\n').filter(line => line);
        const registros = historial.map(line => JSON.parse(line));
        res.json({ success: true, data: registros });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener el historial', error });
    }
});

// Ruta para enviar un mensaje
router.post('/enviar', (req, res) => {
    const { numero, mensaje } = req.body;
    if (!numero || !mensaje) {
        return res.status(400).json({ success: false, message: 'Número y mensaje son requeridos' });
    }

    // Guardar el mensaje en el historial
    const registro = {
        fecha: new Date().toISOString(),
        numero,
        tipo: 'texto',
        contenido: mensaje
    };
    try {
        fs.appendFileSync('historial.json', JSON.stringify(registro) + '\n');
        res.json({ success: true, message: `Mensaje enviado a ${numero}` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al guardar el mensaje en el historial', error });
    }
});

// Ruta para habilitar o deshabilitar el modo silencioso
router.post('/modo-silencioso', (req, res) => {
    const { activar } = req.body;
    if (typeof activar !== 'boolean') {
        return res.status(400).json({ success: false, message: 'El valor de activar debe ser booleano (true o false).' });
    }

    config.silentMode = activar;
    console.log(`🔄 Modo silencioso actualizado a: ${config.silentMode}`);
    res.json({ success: true, message: `Modo silencioso ${activar ? 'activado' : 'desactivado'}.` });
});

// Ruta para conocer el estado actual del modo silencioso
router.get('/modo-silencioso', (req, res) => {
    const config = require('../config/config');
    res.json({ success: true, silentMode: config.silentMode });
});

module.exports = router;
