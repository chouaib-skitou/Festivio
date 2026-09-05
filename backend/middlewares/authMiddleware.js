const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authorization = req.get('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const token = authorization.slice('Bearer '.length).trim();

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return next();
  } catch (_error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
