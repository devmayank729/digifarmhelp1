const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and check if token is in user's tokens array
      req.user = await User.findOne({
        _id: decoded.id,
        'tokens.token': token,
      }).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const farmerOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'Farmer' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized, farmers only' });
  }
};

const labourAgencyOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'Labour Agency' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized, labour agencies only' });
  }
};

const toolServiceProviderOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'Tool/Service Provider' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized, tool/service providers only' });
  }
};

module.exports = { protect, admin, farmerOnly, labourAgencyOnly, toolServiceProviderOnly };