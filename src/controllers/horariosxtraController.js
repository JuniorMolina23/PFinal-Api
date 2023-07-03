const pool = require('../db/db');

exports.obtenerHorariosxEntidad = function (req, res) {
    const query = 'SELECT * FROM public.horarioxentidad_hxe';
    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los registros:', error);
            res.status(500).json({ error: 'Ocurrió un error al obtener los registros' });
        } else {
            res.json(results.rows);
        }
    });
};
exports.obtenerHorarioPorId = function (req, res) {
    const ent_id = req.params.id;

    const query = 'SELECT * FROM public.horarioxentidad_hxe WHERE ent_id = $1';
    const values = [ent_id];

    pool.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al obtener el registro:', error);
            res.status(500).json({ error: 'Ocurrió un error al obtener el registro' });
        } else {
            if (results.rows.length > 0) {
                res.json(results.rows);
            } else {
                res.status(404).json({ error: 'No se encontró ningún registro con el ID proporcionado' });
            }
        }
    });
};

exports.crearHorarioxentidad = function (req, res) {
    const trabajadorId = req.params.trabajadorId;
    const { hor_id, hxe_fecinicio, hxe_fecfin } = req.body;

    const query = 'INSERT INTO public.horarioxentidad_hxe (hor_id, ent_id, hxe_fecinicio, hxe_fecfin) VALUES ($1, $2, $3, $4)';
    const values = [hor_id, trabajadorId, hxe_fecinicio, hxe_fecfin];

    pool.query(query, values, (error, result) => {
        if (error) {
            console.error('Error al crear un registro:', error);
            res.status(500).json({ error: 'Ocurrió un error al crear un registro' });
        } else {
            res.json({ message: 'Registro creado exitosamente' });
        }
    });
};
exports.actualizarHorarioxentidad = function (req, res) {
    const hxe_id = req.params.id;
    const { hor_id, hxe_fecinicio, hxe_fecfin } = req.body;

    const query = 'UPDATE public.horarioxentidad_hxe SET hor_id = $1, hxe_fecinicio = $2, hxe_fecfin = $3 WHERE hxe_id = $4';
    const values = [hor_id, hxe_fecinicio, hxe_fecfin, hxe_id];

    pool.query(query, values, (error, result) => {
        if (error) {
            console.error('Error al actualizar el registro:', error);
            res.status(500).json({ error: 'Ocurrió un error al actualizar el registro' });
        } else {
            res.json({ message: 'Registro actualizado exitosamente' });
        }
    });
};
exports.eliminarHorarioxentidad = function (req, res) {
    const hxe_id = req.params.hxe_id;

    const query = 'DELETE FROM public.horarioxentidad_hxe WHERE hxe_id = $1';
    const values = [hxe_id];

    pool.query(query, values, (error, result) => {
        if (error) {
            console.error('Error al eliminar el horario por entidad:', error);
            res.status(500).json({ error: 'Ocurrió un error al eliminar el horario por entidad' });
        } else {
            res.json({ message: 'Horario por entidad eliminado exitosamente' });
        }
    });
};