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
// const jwt = require('jsonwebtoken');
// const SECRET = process.env.JWT_SECRET;

// module.exports = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.sendStatus(401);

//   try {
//     req.utilisateur = jwt.verify(token, SECRET);
//     next();
//   } catch {
//     res.sendStatus(401);
//   }
// };