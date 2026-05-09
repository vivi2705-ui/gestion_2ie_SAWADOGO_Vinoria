const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
   try {
        const [rows] = await db.query('SELECT * FROM etudiants');
        res.status(200).json({
            success: true,
            data: rows
        });res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des etudiants',
            error: error.message
        });
    }
});

router.post('/', async (req, res) => {
   
 try {
        const { nom,	prenoms,	pays_id	,civilites_id,	dateNaissance,	email,	telephone} = req.body;

        const [result] = await db.query(
            'INSERT INTO etudiants ( nom,	prenoms,	pays_id	,civilites_id,	dateNaissance,	email,	telephone) VALUES (?, ?, ?, ?,?,?,?)',
            [ nom,	prenoms,	pays_id	,civilites_id,	dateNaissance,	email,	telephone]
        );

        const [newEtudiant] = await db.query('SELECT * FROM etudiants WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Etudiant ajoutée avec succès',
            data: newEtudiant[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout de l\'étudiant',
            error: error.message
        });
    };
  });




module.exports = router;