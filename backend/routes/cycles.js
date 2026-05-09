const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM cycles');
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const [rows] = await db.query(
      'SELECT * FROM cycles ORDER BY id LIMIT ? OFFSET ?',
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
      message: 'Erreur lors du chargement des cycles',
      error: error.message
    });
  }
});
router.post('/', async (req, res) => {
   
 try {
        const { libelle, duree_annees} = req.body;

        const [result] = await db.query(
            'INSERT INTO cycles (libelle, duree_annees) VALUES (?, ?)',
            [libelle, duree_annees]
        );

        const [newcycles] = await db.query('SELECT * FROM cycles WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'cycle ajoutée avec succès',
            data: newcycles[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout du cycle',
            error: error.message
        });
    };
  });

  router.delete('/:id', async (req, res) => {
  try {
        const { id } = req.params;

        const [existingcycles] = await db.query('SELECT * FROM cycles  WHERE id = ?', [id]);
        if (existingcycles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'cycle non trouvée'
            });
        }

        await db.query('DELETE FROM cycles WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'Cycle supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du cycle',
            error: error.message
        });
    }
});

  router.put('/:id', async (req, res) => {
try {
        const { libelle, duree_annees} = req.body;
        const { id } = req.params;

        
        const [existingCycle] = await db.query('SELECT * FROM cycles WHERE id = ?', [id]);
        if (existingCycle.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cycle non trouvée'
            });
        }

        await db.query(
            'UPDATE cycles SET libelle = ?, duree_annees = ? WHERE id = ?',
            [libelle, duree_annees, id]
        );

        const [updatedCycle] = await db.query('SELECT * FROM cycles WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'Cycle modifiée avec succès',
            data: updatedCycle[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la modification du cycle',
            error: error.message
        });
    }
});



module.exports = router;