const authService = require('../services/auth.service');
const { signupSchema, loginSchema } = require('../validators/auth.validator');
const { successResponse } = require('../../../core/response/apiResponse');
const { ApiError } = require('../../../core/errors/ApiError');

/**
 * Handle user registration (Employee signup only)
 */
const signup = async (req, res, next) => {
  try {
    // Validate request body
    const parsedBody = signupSchema.parse(req.body);

    const user = await authService.signupEmployee(
      parsedBody.email,
      parsedBody.password
    );

    return successResponse(res, 201, 'Employee registered successfully', { user });
  } catch (error) {
    if (error.name === 'ZodError') {
      const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return next(new ApiError(400, `Validation Error: ${messages}`));
    }
    next(error);
  }
};

/**
 * Handle user login
 */
const login = async (req, res, next) => {
  try {
    // Validate request body
    const parsedBody = loginSchema.parse(req.body);

    const result = await authService.loginUser(
      parsedBody.email,
      parsedBody.password,
      parsedBody.rememberMe
    );

    return successResponse(res, 200, 'Login successful', result);
  } catch (error) {
    if (error.name === 'ZodError') {
      const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return next(new ApiError(400, `Validation Error: ${messages}`));
    }
    next(error);
  }
};

/**
 * Handle access token refresh
 */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new ApiError(400, 'Refresh token is required');
    }

    const result = await authService.refreshAccessToken(refreshToken);

    return successResponse(res, 200, 'Token refreshed successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle user logout (revoke refresh token)
 */
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new ApiError(400, 'Refresh token is required');
    }

    await authService.revokeRefreshToken(refreshToken);

    return successResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user profile
 */
const getMe = async (req, res, next) => {
  try {
    return successResponse(res, 200, 'User profile retrieved successfully', {
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  refresh,
  logout,
  getMe,
};
