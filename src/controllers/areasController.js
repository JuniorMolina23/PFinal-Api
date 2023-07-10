const pool = require('../db/db');

exports.obtenerAreas = function (req, res) {
    const query = 'SELECT * FROM areas_are';

    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener las areas:', error);
            res.status(500).json({ error: 'Ocurrió un error al obtener las areas' });
        } else {
            res.json(results);
        }
    });
}