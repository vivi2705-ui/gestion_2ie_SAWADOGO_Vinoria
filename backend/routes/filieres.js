const express = require('express');
const router = express.Router();
const db = require('../db');

// Backend route for GET /api/filieres with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM filieres');
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const [rows] = await db.query(
      'SELECT * FROM filieres ORDER BY id LIMIT ? OFFSET ?',
      [limit, offset]
    );

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des filières',
      error: error.message
    });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { code, libelle, description } = req.body;
    const { id } = req.params;

    // Check if exists
    const [existing] = await db.query('SELECT * FROM filieres WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Filière non trouvée'
      });
    }

    // Update
    await db.query(
      'UPDATE filieres SET code = ?, libelle = ?, description = ? WHERE id = ?',
      [code, libelle, description, id]
    );

    // Get updated data
    const [updated] = await db.query('SELECT * FROM filieres WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Filière modifiée avec succès',
      data: updated[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification',
      error: error.message
    });
  }
});


router.post('/', async (req, res) => {
   
 try {
        const { code,	libelle	,description} = req.body;

        const [result] = await db.query(
            'INSERT INTO filieres ( code,	libelle	,description) VALUES (?, ?, ?)',
            [ code,	libelle	,description]
        );

        const [newfilieres] = await db.query('SELECT * FROM filieres WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'filiere ajoutée avec succès',
            data: newfilieres[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout de la filiere',
            error: error.message
        });
    };
  });

  router.delete('/:id', async (req, res) => {
  try {
        const { id } = req.params;

        const [existingfilieres] = await db.query('SELECT * FROM filieres WHERE id = ?', [id]);
        if (existingfilieres.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'filieres non trouvée'
            });
        }

        await db.query('DELETE FROM filieres WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'Filiere supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de la filiere',
            error: error.message
        });
    }
});


module.exports = router;