const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
   try {
        const [rows] = await db.query('SELECT * FROM anneeacademiques');
        res.status(200).json({
            success: true,
            data: rows
        });res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des annees',
            error: error.message
        });
    }
});

router.post('/', async (req, res) => {
   
 try {
        const { libelle, date_debut , date_fin, est_active} = req.body;

        const [result] = await db.query(
            'INSERT INTO anneeacademiques (libelle, date_debut, date_fin, est_active) VALUES (?, ?, ?, ?)',
            [libelle, date_debut, date_fin, est_active]
        );

        const [newAnnee] = await db.query('SELECT * FROM anneeacademiques WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Annee scolaire ajoutée avec succès',
            data: newAnnee[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout de l\'annee',
            error: error.message
        });
    };
  });

  router.delete('/:id', async (req, res) => {
  try {
        const { id } = req.params;

        const [existingAnnee] = await db.query('SELECT * FROM anneeacademiques  WHERE id = ?', [id]);
        if (existingAnnee.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Annee non trouvée'
            });
        }

        await db.query('DELETE FROM anneeacademiques WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'Annee supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'annee',
            error: error.message
        });
    }
});


module.exports = router;