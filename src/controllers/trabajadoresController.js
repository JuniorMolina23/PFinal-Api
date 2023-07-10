const pool = require('../db/db');

exports.obtenerTrabajadores = function (req, res) {
  const query = 'SELECT * FROM entidades_ent WHERE ent_rol LIKE $1';
  const values = ['TRA'];
  pool.query(query, values, (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener los datos' });
    } else {
      res.json(results);
    }
  });
};

exports.crearTrabajador = function (req, res) {
  const { codigo, nombre, numero_identificacion, sexo, celular, rol, correo, area_id, activo } = req.body;

  // Iniciar una transacción
  pool.query('BEGIN', (error) => {
    if (error) {
      console.error('Error al iniciar la transacción:', error);
      return res.status(500).json({ error: 'Ocurrió un error al crear un trabajador' });
    }

    // Insertar un nuevo usuario
    const queryInsertUsuario = 'INSERT INTO public.usuarios_usu (usu_codigo) VALUES ($1)';
    const valuesUsuario = [codigo];

    pool.query(queryInsertUsuario, valuesUsuario, (errorUsuario, resultsUsuario) => {
      if (errorUsuario) {
        console.error('Error al crear un usuario:', errorUsuario);
        pool.query('ROLLBACK', (rollbackError) => {
          if (rollbackError) {
            console.error('Error al realizar el rollback:', rollbackError);
          }
          return res.status(500).json({ error: 'Ocurrió un error al crear un usuario' });
        });
      } else {
        // Insertar un nuevo trabajador
        const queryInsertTrabajador = 'INSERT INTO public.entidades_ent (usu_codigo, ent_nombre, ent_nrodocumento, ent_sexo, ent_nrocelular, ent_correo, ent_rol, are_id, ent_activo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
        const valuesTrabajador = [codigo, nombre, numero_identificacion, sexo, celular, correo, rol, area_id, activo];

        pool.query(queryInsertTrabajador, valuesTrabajador, (errorTrabajador, resultsTrabajador) => {
          if (errorTrabajador) {
            console.error('Error al crear un trabajador:', errorTrabajador);
            pool.query('ROLLBACK', (rollbackError) => {
              if (rollbackError) {
                console.error('Error al realizar el rollback:', rollbackError);
              }
              return res.status(500).json({ error: 'Ocurrió un error al crear un trabajador' });
            });
          } else {
            // Commit de la transacción
            pool.query('COMMIT', (commitError) => {
              if (commitError) {
                console.error('Error al realizar el commit:', commitError);
                return res.status(500).json({ error: 'Ocurrió un error al crear un trabajador' });
              }
              res.json({ message: 'Trabajador creado exitosamente' });
            });
          }
        });
      }
    });
  });
};

exports.actualizarTrabajador = function (req, res) {
  const trabajadorId = req.params.id;
  const { nombre, numero_identificacion, sexo, celular, correo, rol, area_id, activo } = req.body;

  const query = 'UPDATE entidades_ent SET ent_nombre = $1 , ent_nrodocumento = $2, ent_sexo = $3, ent_nrocelular = $4, ent_correo = $5, ent_rol = $6, are_id = $7, ent_activo = $8 WHERE ent_id = $9';
  const values = [nombre, numero_identificacion, sexo, celular, correo, rol, area_id, activo, trabajadorId];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error al actualizar el trabajador:', error);
      res.status(500).json({ error: 'Ocurrió un error al actualizar el trabajador' });
    } else {
      res.json({ message: 'Trabajador actualizado exitosamente' });
    }
  });
};

exports.eliminarTrabajador = function (req, res) {
  const trabajadorId = req.params.id;

  const query = 'DELETE FROM entidades_ent WHERE ent_id = $1';
  const values = [trabajadorId];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error al eliminar el trabajador:', error);
      res.status(500).json({ error: 'Ocurrió un error al eliminar el trabajador', error });
    } else {
      res.json({ message: 'Trabajador eliminado exitosamente' });
    }
  });
};
