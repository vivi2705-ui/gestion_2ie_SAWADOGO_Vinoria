const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
   try {
        const [rows] = await db.query('SELECT * FROM inscriptions');
        res.status(200).json({
            success: true,
            data: rows
        });res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des etudiants inscrit',
            error: error.message
        });
    }
});

router.post('/', async (req, res) => {
   
 try {
        const { etudiants_id,	parcours_id,	annee_academique_id,	decisions_id,	dateInscription} = req.body;

        const [result] = await db.query(
            'INSERT INTO inscriptions ( etudiants_id,	parcours_id,	annee_academique_id,	decisions_id,	dateInscription) VALUES (?, ?, ?, ?,?)',
            [ etudiants_id,	parcours_id,	annee_academique_id,	decisions_id,	dateInscription]
        );

        const [newInscriptions] = await db.query('SELECT * FROM inscriptions WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Etudiant inscrit avec succès',
            data: newInscriptions[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'inscription de l\'étudiant',
            error: error.message
        });
    };
  });




module.exports = router;