const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../../../core/database/prisma');
const { env } = require('../../../core/config/env');
const { ApiError } = require('../../../core/errors/ApiError');

/**
 * Generate Access and Refresh tokens for a user
 * @param {Object} user - The user object
 * @param {boolean} rememberMe - Whether to extend refresh token expiration
 */
const generateAuthTokens = async (user, rememberMe = false) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  // Access token: short-lived (15 minutes)
  const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });

  // Refresh token: longer-lived (30 days if rememberMe, otherwise 7 days)
  const refreshExpiresInDays = rememberMe ? 30 : 7;
  const refreshExpiresAt = new Date();
  refreshExpiresAt.setDate(refreshExpiresAt.getDate() + refreshExpiresInDays);

  const refreshToken = jwt.sign(
    { id: user.id },
    env.JWT_REFRESH_SECRET,
    { expiresIn: `${refreshExpiresInDays}d` }
  );

  // Store refresh token in database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshExpiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    expiresAt: refreshExpiresAt,
  };
};

/**
 * Sign up a new employee
 * @param {string} email
 * @param {string} password
 */
const signupEmployee = async (email, password) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new ApiError(400, 'Email is already registered');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Deriving user display name from email address prefix
  const derivedName = email.split('@')[0];

  // Create user using DB fields: passwordHash and name
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      name: derivedName,
      role: 'EMPLOYEE', // Default role for employee registration
    },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      createdAt: true,
    },
  });

  return user;
};

/**
 * Authenticate a user via email and password
 * @param {string} email
 * @param {string} password
 * @param {boolean} rememberMe
 */
const loginUser = async (email, password, rememberMe = false) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid email or password');
  }

  // Compare with passwordHash
  const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordMatch) {
    throw new ApiError(400, 'Invalid email or password');
  }

  const tokens = await generateAuthTokens(user, rememberMe);

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    ...tokens,
  };
};

/**
 * Refresh an access token using a valid refresh token
 * @param {string} token - The refresh token
 */
const refreshAccessToken = async (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const dbToken = await prisma.refreshToken.findFirst({
    where: {
      token: token,
      revoked: false,
    },
    include: {
      user: true,
    },
  });

  if (!dbToken || dbToken.expiresAt < new Date()) {
    if (dbToken) {
      // Revoke if expired
      await prisma.refreshToken.update({
        where: { id: dbToken.id },
        data: { revoked: true },
      });
    }
    throw new ApiError(401, 'Invalid, expired, or revoked refresh token');
  }

  // Generate new tokens (rotational pattern)
  // 1. Revoke the old refresh token
  await prisma.refreshToken.update({
    where: { id: dbToken.id },
    data: { revoked: true },
  });

  // 2. Generate new access & refresh token pair
  const tokens = await generateAuthTokens(dbToken.user, true); // keep rememberMe true for simple rotation

  return {
    user: {
      id: dbToken.user.id,
      email: dbToken.user.email,
      role: dbToken.user.role,
      name: dbToken.user.name,
    },
    ...tokens,
  };
};

/**
 * Revoke a refresh token (Logout)
 * @param {string} token
 */
const revokeRefreshToken = async (token) => {
  const dbToken = await prisma.refreshToken.findUnique({
    where: { token },
  });

  if (dbToken) {
    await prisma.refreshToken.update({
      where: { id: dbToken.id },
      data: { revoked: true },
    });
  }
};

module.exports = {
  signupEmployee,
  loginUser,
  refreshAccessToken,
  revokeRefreshToken,
};
