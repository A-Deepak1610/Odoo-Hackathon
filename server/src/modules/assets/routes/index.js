const { Router } = require('express');
const { getAssets, getMyAssets, getDepartmentAssets } = require('../controllers/assets.controller');
const { authenticateJWT, authorizeRoles } = require('../../auth/middlewares/auth.middleware');

const router = Router();

// Secure all assets routes
router.use(authenticateJWT);

router.get('/', getAssets);
router.get('/my', getMyAssets);
router.get('/department', authorizeRoles('DEPARTMENT_HEAD'), getDepartmentAssets);

module.exports = { router };
