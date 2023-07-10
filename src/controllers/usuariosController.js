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

exports.verPerfil = function (req, res) {
    const usuCodigo = req.params.usuCodigo;
    const query = 'SELECT * FROM usuarios_usu WHERE usu_codigo = $1';

    pool.query(query, [usuCodigo], (error, results) => {
        if (error) {
            console.error('Error al obtener el perfil del usuario:', error);
            res.status(500).json({ error: 'Ocurrió un error al obtener el perfil del usuario' });
        } else if (results.rows.length === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
            const perfilUsuario = results.rows[0];
            res.json(perfilUsuario);
        }
    });
}

exports.autenticarUsuario = function (req, res) {
    const { codigo, clave } = req.body;

    console.log("Valor de codigo:", codigo);
    console.log("Valor de clave:", clave);

    // Verificar las credenciales del usuario en la base de datos
    const query = "SELECT usu.usu_codigo, usu.usu_clave = md5('0000') AS clave_inicial, ent.ent_rol FROM usuarios_usu usu INNER JOIN entidades_ent ent ON usu.usu_codigo = ent.usu_codigo WHERE usu.usu_codigo LIKE $1 AND usu.usu_clave LIKE md5($2) ";
    pool.query(query, [codigo, clave], (error, results) => {
        if (error) {
            console.error("Error al verificar las credenciales:", error);
            res.status(500).json({ error: "Ocurrió un error al verificar las credenciales" });
        } else if (results.rows.length > 0) {
            const { usu_codigo, clave_inicial, ent_rol } = results.rows[0];

            if (clave_inicial) {
                // Mostrar una alerta o mensaje para solicitar al usuario que actualice su contraseña
                res.json({ requiresPasswordUpdate: true, usu_codigo });
            } else {
                // Las credenciales son válidas, generamos un token de acceso
                const accessToken = jwt.sign({ codigo }, "secretKey");

                // Obtener los campos seleccionados de los resultados

                // Enviar los campos seleccionados como respuesta
                res.json({ usu_codigo, clave_inicial, ent_rol, accessToken });
                console.log(usu_codigo, clave_inicial, ent_rol);
                // Enviar el token de acceso como respuesta
            }
        } else {
            // Las credenciales no son válidas, enviamos una respuesta con código de estado 401 Unauthorized
            res.status(401).json({ error: "Credenciales inválidas" });
        }
    });
};

exports.cambiarPassword = function (req, res) {
    const { newPassword, usuCodigo } = req.body;

    console.log("ACT -====>>>>", newPassword, usuCodigo);


    // Actualizar la contraseña en la base de datos
    const query = "UPDATE usuarios_usu SET usu_clave = md5($1) WHERE usu_codigo = $2";
    const values = [newPassword, usuCodigo];

    pool.query(query, values, (error, result) => {
        if (error) {
            console.error("Error al actualizar la contraseña:", error);
            res.status(500).json({ error: "Ocurrió un error al actualizar la contraseña" });
        } else {
            // Actualización de contraseña exitosa, enviar una respuesta exitosa
            res.json({ message: "Contraseña actualizada exitosamente" });
        }
    });
}

exports.registrarUsuario = function (req, res) {
    const { codigo, clave, nombre, nro_documento, sexo, nro_celular, correo, rol, area_id, activo } = req.body;

    const checkUserQuery = 'SELECT * FROM usuarios_usu WHERE usu_codigo = $1';
    pool.query(checkUserQuery, [codigo], (error, results) => {
        if (error) {
            console.error('Error al verificar el usuario:', error);
            res.status(500).json({ error: 'Ocurrió un error al verificar el usuario' });
        } else if (results.rows.length > 0) {
            res.status(400).json({ error: 'El usuario ya existe' });
        } else {
            const insertUserQuery = 'INSERT INTO usuarios_usu (usu_codigo, usu_clave) VALUES ($1, md5($2))';
            const userValues = [codigo, clave];

            pool.query(insertUserQuery, userValues, (error, result) => {
                if (error) {
                    console.error('Error al registrar un usuario:', error);
                    res.status(500).json({ error: 'Ocurrió un error al registrar un usuario' });
                } else {
                    const insertEntityQuery = 'INSERT INTO entidades_ent (usu_codigo, ent_nombre, ent_nrodocumento, ent_sexo, ent_nrocelular, ent_correo, ent_rol, are_id, ent_activo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
                    const entityValues = [codigo, nombre, nro_documento, sexo, nro_celular, correo, rol, area_id, activo];

                    pool.query(insertEntityQuery, entityValues, (error, result) => {
                        if (error) {
                            console.error('Error al registrar un usuario:', error);
                            res.status(500).json({ error: 'Ocurrió un error al registrar un usuario' });
                        } else {
                            res.json({ message: 'Usuario registrado exitosamente' });
                        }
                    });
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
