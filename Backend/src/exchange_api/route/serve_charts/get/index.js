const appErr = require('this_pkg/error');
const path = require('path');
const axios = require('axios');
const fs = require('fs').promises;

exports.handler = async (req, res) => {

    try {
        // Haz una solicitud a tu servicio de Python
        const pythonServiceResponse = await axios.get(`http://python_service:5020/charts/${req.params.filename}`, {
            responseType: 'arraybuffer'
        });

        const contentType =
            req.params.filename.endsWith('.svg') ? 'image/svg+xml' :
                req.params.filename.endsWith('.pdf') ? 'application/pdf' : 'image/png';

        console.log(contentType);

        res.setHeader('Content-Type', contentType);

        // Envía la imagen al frontend
        res.send(pythonServiceResponse.data);
    } catch (error) {
        console.error('Error al obtener la imagen del servicio de Python:', error);
        res.status(500).send('Error interno del servidor');
    }
};