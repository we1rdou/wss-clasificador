// Entry point of the application
const express = require('express');
const app = express();
const config = require('./src/config/config');
const apiRoutes = require('./src/api/api');
const { arrancarBot } = require('./src/bot/bot');
const path = require('path');

// Middleware
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Servir archivos estáticos desde la carpeta 'src'
app.use(express.static('src'));


// Servir el dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'dashboard', 'dashboard.html'));
});

// Start server
app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});

// Start bot
arrancarBot();
