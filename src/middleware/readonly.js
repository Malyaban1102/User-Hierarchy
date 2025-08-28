module.exports.customerReadOnly = (req, res, next) => {
    if (req.user?.role === 'CUSTOMER') {
      const method = req.method.toUpperCase();
      if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        return res.status(403).json({ message: 'Customers have read-only access' });
      }
    }
    next();
  };
  