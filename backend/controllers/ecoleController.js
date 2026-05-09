const db = require('../db');

// Récupérer toutes les écoles
exports.getAllEcoles = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ecoles WHERE delete_at is null ORDER BY created_at DESC');
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des écoles',
            error: error.message
        });
    }
};

// Récupérer une école par ID
exports.getEcoleById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ecoles WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'École non trouvée'
            });
        }
        
        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'école',
            error: error.message
        });
    }
};

// Ajouter une école
exports.createEcole = async (req, res) => {
    try {
        const { libelle, adresse, telephone, email } = req.body;

        // Validation
        if (!libelle || !adresse || !telephone || !email) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs sont obligatoires'
            });
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email invalide'
            });
        }

        const [result] = await db.query(
            'INSERT INTO ecoles (libelle, adresse, telephone, email) VALUES (?, ?, ?, ?)',
            [libelle, adresse, telephone, email]
        );

        const [newEcole] = await db.query('SELECT * FROM ecoles WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'École ajoutée avec succès',
            data: newEcole[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout de l\'école',
            error: error.message
        });
    }
};

// Modifier une école
exports.updateEcole = async (req, res) => {
    try {
        const { libelle, adresse, telephone, email } = req.body;
        const { id } = req.params;

        // Vérifier si l'école existe
        const [existingEcole] = await db.query('SELECT * FROM ecoles WHERE id = ?', [id]);
        if (existingEcole.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'École non trouvée'
            });
        }

        // Validation
        if (!libelle || !adresse || !telephone || !email) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs sont obligatoires'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email invalide'
            });
        }

        await db.query(
            'UPDATE ecoles SET libelle = ?, adresse = ?, telephone = ?, email = ? WHERE id = ?',
            [libelle, adresse, telephone, email, id]
        );

        const [updatedEcole] = await db.query('SELECT * FROM ecoles WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'École modifiée avec succès',
            data: updatedEcole[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la modification de l\'école',
            error: error.message
        });
    }
};

// Supprimer une école
exports.deleteEcole = async (req, res) => {
    try {
        const { id } = req.params;

        const [existingEcole] = await db.query('SELECT * FROM ecoles WHERE id = ?', [id]);
        if (existingEcole.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'École non trouvée'
            });
        }

        await db.query('DELETE FROM ecoles WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'École supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'école',
            error: error.message
        });
    }
};