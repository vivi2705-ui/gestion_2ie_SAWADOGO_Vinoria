// routes/auth.js
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

const SECRET = process.env.JWT_SECRET || 'secret_key';

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      'SELECT * FROM utilisateurs WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id },
      SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, nom, email FROM utilisateurs WHERE id = ?',
      [req.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;




