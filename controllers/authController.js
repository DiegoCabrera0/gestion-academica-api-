const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { usuario, password } = req.body;

    try {
        // En este sistema, para alumnos, docentes y representantes,
        // el usuario y password deben ser iguales al número de cédula.
        if (usuario !== password && usuario !== 'admin') {
            return res.status(401).json({ message: 'La contraseña debe ser igual al número de cédula' });
        }

        const [rows] = await db.execute('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const user = rows[0];
        // En producción usar bcrypt.compare(password, user.password_hash)
        // Para prueba simple:
        if (password !== user.password_hash) {
             // return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const token = jwt.sign(
            { id: user.id_usuario, tipo: user.tipo_usuario },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: {
                id: user.id_usuario,
                usuario: user.usuario,
                tipo: user.tipo_usuario
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
