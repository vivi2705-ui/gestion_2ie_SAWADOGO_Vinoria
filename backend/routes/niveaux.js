const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
   try {
        const [rows] = await db.query('SELECT * FROM niveaux');
        res.status(200).json({
            success: true,
            data: rows
        });res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des niveaux',
            error: error.message
        });
    }
});

router.post('/', async (req, res) => {
   
 try {
        const { libelle	,ordre} = req.body;

        const [result] = await db.query(
            'INSERT INTO niveaux (libelle	,ordre) VALUES (?, ?)',
            [libelle	,ordre]
        );

        const [newniveaux] = await db.query('SELECT * FROM niveaux WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'niveaux ajoutée avec succès',
            data: newniveaux[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout du niveaux',
            error: error.message
        });
    };
  });

  router.delete('/:id', async (req, res) => {
  try {
        const { id } = req.params;

        const [existingniveaux] = await db.query('SELECT * FROM niveaux  WHERE id = ?', [id]);
        if (existingniveaux.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'niveaux non trouvée'
            });
        }

        await db.query('DELETE FROM niveaux WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'niveaux supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du niveaux',
            error: error.message
        });
    }
});


module.exports = router;