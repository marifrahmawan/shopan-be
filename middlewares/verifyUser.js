const jwt = require('jsonwebtoken');

/** @type {import("express").RequestHandler} */
const verifyToken = (req, res, next) => {
  const authHeader = req.get('Authorization');
  let decodedToken;

  if (!authHeader) {
    return res.status(401).json({ message: 'Unathorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  if (decodedToken === null) {
    return res.status(403).json({ message: 'Not authenticated' });
  }

  req.user = decodedToken;

  next();
};

/** @type {import("express").RequestHandler} */
const verifyTokenAndAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user._id) {
      next();
    } else {
      return res.status(401).json({ message: 'Not allowed' });
    }
  });
};

/** @type {import("express").RequestHandler} */
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user) {
      return res.status(403).json({ message: 'Not Allowed' });
    }

    if (req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Not Allowed' });
    }
  });
};

module.exports = { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin };
