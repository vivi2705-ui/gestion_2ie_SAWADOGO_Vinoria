// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secret_key';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
};
