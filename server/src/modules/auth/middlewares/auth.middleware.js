const jwt = require('jsonwebtoken');
const { env } = require('../../../core/config/env');
const { ApiError } = require('../../../core/errors/ApiError');
const { prisma } = require('../../../core/database/prisma');

/**
 * Middleware to authenticate JWT access tokens
 */
const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Access token has expired');
      }
      throw new ApiError(401, 'Invalid access token');
    }

    // Optional: Double check user exists in DB to prevent active tokens of deleted accounts
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { 
        id: true, 
        email: true, 
        role: true, 
        name: true,
        phone: true,
        address: true,
        avatarUrl: true,
        departmentId: true
      },
    });

    if (!user) {
      throw new ApiError(401, 'User account no longer exists');
    }

    // Attach user payload to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to authorize access based on user roles (RBAC)
 * @param {...string} roles - Allowed roles
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Access denied: insufficient permissions'));
    }

    next();
  };
};

module.exports = {
  authenticateJWT,
  authorizeRoles,
};
