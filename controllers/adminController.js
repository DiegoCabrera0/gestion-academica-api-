const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
    const { role, userData } = req.body;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Crear el usuario en la tabla 'usuarios'
        // El password por defecto es la cédula (como se solicitó)
        const passwordHash = userData.cedula; // En producción usar bcrypt.hash
        const [userResult] = await connection.execute(
            'INSERT INTO usuarios (usuario, password_hash, tipo_usuario) VALUES (?, ?, ?)',
            [userData.cedula, passwordHash, role]
        );
        const userId = userResult.insertId;

        // 2. Insertar en la tabla específica según el rol
        if (role === 'estudiante') {
            await connection.execute(
                'INSERT INTO estudiantes (nombres, apellidos, cedula, fecha_nacimiento, curso, paralelo, id_usuario, id_representante) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [userData.nombres, userData.apellidos, userData.cedula, userData.fecha_nacimiento, userData.curso, userData.paralelo, userId, userData.id_representante]
            );
        } else if (role === 'docente') {
            await connection.execute(
                'INSERT INTO docentes (nombre, especialidad, id_usuario) VALUES (?, ?, ?)',
                [userData.nombre_completo, userData.especialidad, userId]
            );
        } else if (role === 'representante') {
            await connection.execute(
                'INSERT INTO representantes (nombre, telefono, correo) VALUES (?, ?, ?)',
                [userData.nombre_completo, userData.telefono, userData.correo]
            );
            // Nota: Representante no tiene id_usuario obligatoriamente en el esquema original,
            // pero si se requiere acceso se debe vincular.
        }

        await connection.commit();
        res.status(201).json({ message: 'Usuario creado exitosamente', userId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: error.message });
    } finally {
        connection.release();
    }
};

exports.getStudents = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id_estudiante as id, CONCAT(nombres, " ", apellidos) as name, curso as info FROM estudiantes');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTeachers = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id_docente as id, nombre as name, especialidad as info FROM docentes');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRepresentatives = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id_representante as id, nombre as name, telefono as info FROM representantes');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id, role } = req.params;
    try {
        if (role === 'estudiante') {
            await db.execute('DELETE FROM estudiantes WHERE id_estudiante = ?', [id]);
        } else if (role === 'docente') {
            await db.execute('DELETE FROM docentes WHERE id_docente = ?', [id]);
        } else if (role === 'representante') {
            await db.execute('DELETE FROM representantes WHERE id_representante = ?', [id]);
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
