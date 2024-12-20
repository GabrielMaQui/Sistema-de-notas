const { compose } = require('compose-middleware');
const { verifyToken } = require('./auth.service');
const { getOneUserEmail } = require('../utils//user.service');

function isAuthenticated() {
  return compose([
    async (req, res, next) => {
      const token = req.headers?.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const decoded = verifyToken(token);

      if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await getOneUserEmail(decoded.email);

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      req.user = user;

      next();
    },
  ]);
}

function hasRole(allowRoles) {
  return compose([
    isAuthenticated(),
    (req, res, next) => {
      const { role } = req.user;

      if (!allowRoles.includes(role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    },
  ]);
}

module.exports = { isAuthenticated, hasRole };
