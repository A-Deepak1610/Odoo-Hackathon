const { Router } = require('express');
const { getEmployeeDashboard } = require('../controllers');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

// Route to get personalized employee metrics
router.get('/employee', authenticateJWT, getEmployeeDashboard);

module.exports = { router };
