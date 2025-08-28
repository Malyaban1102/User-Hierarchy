const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function auth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role, customerId }
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
