const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
   try {
        const [rows] = await db.query('SELECT * FROM civilites');
        res.status(200).json({
            success: true,
            data: rows
        });res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des civilités',
            error: error.message
        });
    }
});



module.exports = router;