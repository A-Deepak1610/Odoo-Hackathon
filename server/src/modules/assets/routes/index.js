const { Router } = require('express');
const { getAssets, getMyAssets } = require('../controllers/assets.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

// Secure all assets routes
router.use(authenticateJWT);

router.get('/', getAssets);
router.get('/my', getMyAssets);

module.exports = { router };
