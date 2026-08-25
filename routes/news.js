const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM comunicados ORDER BY fecha DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
