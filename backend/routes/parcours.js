const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
   try {
        const [rows] = await db.query('SELECT * FROM parcours');
        res.status(200).json({
            success: true,
            data: rows
        });res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des parcours',
            error: error.message
        });
    }
});

router.post('/', async (req, res) => {
   
 try {
        const { libelle	,specialites_id,	niveaux_id	,cycles_id} = req.body;

        const [result] = await db.query(
            'INSERT INTO parcours (libelle	,specialites_id,	niveaux_id	,cycles_id) VALUES (?, ?, ?, ?)',
            [libelle	,specialites_id,	niveaux_id	,cycles_id]
        );

        const [newparcours] = await db.query('SELECT * FROM parcours WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'parcours ajoutée avec succès',
            data: newparcours[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout du parcours',
            error: error.message
        });
    };
  });

  router.delete('/:id', async (req, res) => {
  try {
        const { id } = req.params;

        const [existingparcours] = await db.query('SELECT * FROM parcours  WHERE id = ?', [id]);
        if (existingparcours.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'parcours non trouvée'
            });
        }

        await db.query('DELETE FROM parcours WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'parcours supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du parcours',
            error: error.message
        });
    }
});


module.exports = router;