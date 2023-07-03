const pool = require('../db/db');

exports.obtenerHorarios = function (req, res) {
  const query = 'SELECT * FROM horarios_hor';
  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener los horarios:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener los horarios' });
    } else {
      res.json(results.rows);
    }
  });
};

exports.obtenerHorario = function (req, res) {
  const horarioId = req.params.id;
  const query = 'SELECT * FROM horarios_hor WHERE hor_id = $1';
  const values = [horarioId];

  pool.query(query, values, (error, results) => {
    if (error) {
      console.error('Error al obtener el horario:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener el horario' });
    } else if (results.rows.length === 0) {
      res.status(404).json({ error: 'Horario no encontrado' });
    } else {
      res.json(results.rows);
    }
  });
};

exports.crearHorario = function (req, res) {
  const { turno, horaInicio, hora, nroDias } = req.body;
  const query = 'INSERT INTO horarios_hor (hor_turno, hor_horainicio, hor_hora, hor_nrodias) VALUES ($1, $2, $3, $4)';
  const values = [turno, horaInicio, hora, nroDias];

  pool.query(query, values, (error) => {
    if (error) {
      console.error('Error al crear el horario:', error);
      res.status(500).json({ error: 'Ocurrió un error al crear el horario' });
    } else {
      res.json({ message: 'Horario creado exitosamente' });
    }
  });
};

exports.actualizarHorario = function (req, res) {
  const horarioId = req.params.id;
  const { turno, horaInicio, hora, nroDias } = req.body;
  const query = 'UPDATE horarios_hor SET hor_turno = $1, hor_horainicio = $2, hor_hora = $3, hor_nrodias = $4 WHERE hor_id = $5';
  const values = [turno, horaInicio, hora, nroDias, horarioId];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error al actualizar el horario:', error);
      res.status(500).json({ error: 'Ocurrió un error al actualizar el horario' });
    } else if (result.rowCount === 0) {
      res.status(404).json({ error: 'Horario no encontrado' });
    } else {
      res.json({ message: 'Horario actualizado exitosamente' });
    }
  });
};

exports.eliminarHorario = function (req, res) {
  const horarioId = req.params.id;
  const query = 'DELETE FROM horarios_hor WHERE hor_id = $1';
  const values = [horarioId];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error al eliminar el horario:', error);
      res.status(500).json({ error: 'Ocurrió un error al eliminar el horario' });
    } else if (result.rowCount === 0) {
      res.status(404).json({ error: 'Horario no encontrado' });
    } else {
      res.json({ message: 'Horario eliminado exitosamente' });
    }
  });
};
