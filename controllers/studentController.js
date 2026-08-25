const db = require('../config/db');

exports.getProfile = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM estudiantes WHERE id_usuario = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Estudiante no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getGrades = async (req, res) => {
    try {
        const query = `
            SELECT m.nombre as materia, c.periodo, c.parcial, c.nota
            FROM calificaciones c
            JOIN materias m ON c.id_materia = m.id_materia
            WHERE c.id_estudiante = (SELECT id_estudiante FROM estudiantes WHERE id_usuario = ?)`;
        const [rows] = await db.execute(query, [req.params.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAttendance = async (req, res) => {
    try {
        const query = 'SELECT fecha, estado FROM asistencia WHERE id_estudiante = (SELECT id_estudiante FROM estudiantes WHERE id_usuario = ?)';
        const [rows] = await db.execute(query, [req.params.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSchedule = async (req, res) => {
    try {
        const query = `
            SELECT h.dia, h.hora_inicio, h.hora_fin, m.nombre as materia, d.nombre as docente
            FROM horarios h
            JOIN materias m ON h.id_materia = m.id_materia
            JOIN docentes d ON h.id_docente = d.id_docente
            WHERE h.curso = ?`;
        const [rows] = await db.execute(query, [req.params.curso]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const query = `
            SELECT t.descripcion, t.fecha_entrega, t.estado, m.nombre as materia
            FROM tareas t
            JOIN materias m ON t.id_materia = m.id_materia
            WHERE t.id_materia IN (SELECT id_materia FROM horarios WHERE curso = (SELECT curso FROM estudiantes WHERE id_usuario = ?))`;
        const [rows] = await db.execute(query, [req.params.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    const { foto } = req.body;
    try {
        await db.execute('UPDATE estudiantes SET foto = ? WHERE id_usuario = ?', [foto, req.params.id]);
        res.json({ message: 'Perfil actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
