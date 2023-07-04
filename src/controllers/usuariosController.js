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
            res.json(results.rows);
        }
    });
}
exports.registrarUsuario = function (req, res) {
    const { codigo, clave } = req.body;
    const checkUserQuery = 'SELECT * FROM usuarios_usu WHERE usu_codigo LIKE $1';
    pool.query(checkUserQuery, [codigo], (error, results) => {
        if (error) {
            console.error('Error al verificar el usuario:', error);
            res.status(500).json({ error: 'Ocurrió un error al verificar el usuario' });
        } else if (results.rows.length > 0) {
            res.status(400).json({ error: 'El usuario ya existe' });
        } else {
            const insertUserQuery = 'INSERT INTO usuarios_usu (usu_codigo, usu_clave) VALUES ($1, md5($2))';
            const values = [codigo, clave];

            pool.query(insertUserQuery, values, (error, result) => {
                if (error) {
                    console.error('Error al registrar un usuario:', error);
                    res.status(500).json({ error: 'Ocurrió un error al registrar un usuario' });
                } else {
                    res.json({ message: 'Usuario registrado exitosamente' });
                }
            });
        }
    });
};

exports.autenticarUsuario = function (req, res) {
    const { codigo, clave } = req.body;
    console.log("Valor de codigo:", codigo);
    console.log("Valor de clave:", clave);
    const query = "SELECT * FROM usuarios_usu WHERE usu_codigo LIKE $1 AND usu_clave LIKE md5($2)";
    pool.query(query, [codigo, clave], (error, results) => {
        if (error) {
            console.error("Error al verificar las credenciales:", error);
            res.status(500).json({ error: "Ocurrió un error al verificar las credenciales" });
        } else if (results.rows.length > 0) {
            const accessToken = jwt.sign({ codigo }, "secretKey");
            console.log("Token de acceso:", accessToken);
            res.json({ accessToken });
        } else {
            res.status(401).json({ error: "Credenciales inválidas" });
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
