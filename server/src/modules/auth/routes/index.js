const { Router } = require('express');
const { signup, login, refresh, logout, getMe, updateProfile, changePassword } = require('../controllers');
const { authenticateJWT } = require('../middlewares/auth.middleware');

const router = Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);

// Protected routes
router.post('/logout', logout); // Can also be authenticated, but takes token in body
router.get('/me', authenticateJWT, getMe);
router.put('/profile', authenticateJWT, updateProfile);
router.put('/change-password', authenticateJWT, changePassword);

module.exports = { router };
