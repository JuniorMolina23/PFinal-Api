const pool = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.obtenerUsuarios = function (req, res) {
    const query = 'SELECT * FROM usuarios_usu';
    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los usuarios:', error);
            res.status(500).json({ error: 'Ocurrió un error al obtener los usuarios' });
        } else {
            res.json(results);
        }
    });
}

exports.autenticarUsuario = function (req, res) {
    const { codigo, clave } = req.body;

    console.log("Valor de codigo:", codigo);
    console.log("Valor de clave:", clave);

    // Verificar las credenciales del usuario en la base de datos
    const query = "SELECT * FROM usuarios_usu WHERE usu_codigo LIKE $1 AND usu_clave LIKE md5($2)";
    pool.query(query, [codigo, clave], (error, results) => {
        if (error) {
            console.error("Error al verificar las credenciales:", error);
            res.status(500).json({ error: "Ocurrió un error al verificar las credenciales" });
        } else if (results.rows.length > 0) {
            // Las credenciales son válidas, generamos un token de acceso
            const accessToken = jwt.sign({ codigo }, "secretKey");

            console.log("Token de acceso:", accessToken);

            // Enviar el token de acceso como respuesta
            res.json({ accessToken });
        } else {
            // Las credenciales no son válidas, enviamos una respuesta con código de estado 401 Unauthorized
            res.status(401).json({ error: "Credenciales inválidas" });
        }
    });
};

exports.registrarUsuario = function (req, res) {
    const { codigo, clave } = req.body;

    // Verificar si el usuario ya existe en la base de datos
    const checkUserQuery = 'SELECT * FROM usuarios_usu WHERE usu_codigo LIKE $1';
    pool.query(checkUserQuery, [codigo], (error, results) => {
        if (error) {
            console.error('Error al verificar el usuario:', error);
            res.status(500).json({ error: 'Ocurrió un error al verificar el usuario' });
        } else if (results.rows.length > 0) {
            res.status(400).json({ error: 'El usuario ya existe' });
        } else {
            // Insertar el nuevo usuario en la base de datos
            const insertUserQuery = 'INSERT INTO usuarios_usu (usu_codigo, usu_clave) VALUES ($1, md5($2))';
            const values = [codigo, clave];

            pool.query(insertUserQuery, values, (error, result) => {
                if (error) {
                    console.error('Error al registrar un usuario:', error);
                    res.status(500).json({ error: 'Ocurrió un error al registrar un usuario' });
                } else {
                    res.json({ message: 'Usuario registrado exitosamente' });
                    /* Si se proporciona toda la informacion 
                     // Insertar el nuevo usuario en entidades
                      const insertUserQuery = 'INSERT INTO entidades_ent (usu_codigo, ent_nombre, ent_nrodocumento , ent_sexo, ent_nrocelular, ent_rol, are_id, ent_activo) VALUES ($1, $2,$3, $4,$5, $6, $7)';
                      const values = [codigo, nombre, nro_documento, sexo, rol, area_id, activo];
            
                      pool.query(insertUserQuery, values, (error, result) => {
                        if (error) {
                          console.error('Error al registrar un usuario:', error);
                          res.status(500).json({ error: 'Ocurrió un error al registrar un usuario' });
                        } else {
                          res.json({ message: 'Usuario registrado exitosamente' });
                        }
                      });*/
                }
            });
        }
    });
};

exports.actualizarPerfil = function (req, res) {
    const codigoUsuario = req.params.id;
    const { clave } = req.body;

    const query = 'UPDATE usuarios_usu SET usu_clave = md5($1) WHERE usu_codigo = $2';
    const values = [clave, codigoUsuario];

    pool.query(query, values, (error, result) => {
        if (error) {
            console.error('Error al actualizar actualizar un usuario existente:', error);
            res.status(500).json({ error: 'Ocurrió un error al actualizar actualizar un usuario existente' });
        } else {
            res.json({ message: 'Usuario actualizado exitosamente' });
        }
    });
};
