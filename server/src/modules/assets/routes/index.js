const { Router } = require('express');
const { getAssets, getMyAssets, createAsset, deleteAsset } = require('../controllers/assets.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

// Secure all assets routes
router.use(authenticateJWT);

router.get('/', getAssets);
router.get('/my', getMyAssets);
router.post('/', createAsset);
router.delete('/:id', deleteAsset);

module.exports = { router };
