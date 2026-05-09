const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
   try {
        const [rows] = await db.query('SELECT * FROM specialites');
        res.status(200).json({
            success: true,
            data: rows
        });res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des specialites',
            error: error.message
        });
    }
});

router.post('/', async (req, res) => {
   
 try {
        const { libelle,	filieres_id,	description} = req.body;

        const [result] = await db.query(
            'INSERT INTO specialites (libelle,	filieres_id,	description) VALUES (?, ?, ?)',
            [libelle,	filieres_id,	description]
        );

        const [newspecialites] = await db.query('SELECT * FROM specialites WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'specialites ajoutée avec succès',
            data: newspecialites[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout de la specialites',
            error: error.message
        });
    };
  });

  router.delete('/:id', async (req, res) => {
  try {
        const { id } = req.params;

        const [existingspecialites] = await db.query('SELECT * FROM specialites  WHERE id = ?', [id]);
        if (existingspecialites.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'specialites non trouvée'
            });
        }

        await db.query('DELETE FROM specialites WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'specialites supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de la specialites',
            error: error.message
        });
    }
});


module.exports = router;