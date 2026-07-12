const { Router } = require('express');
const { getAssets, getMyAssets, getAssetById, createAsset, updateAsset } = require('../controllers/assets.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

// Secure all assets routes
router.use(authenticateJWT);

router.get('/', getAssets);
router.get('/my', getMyAssets);
router.get('/:id', getAssetById);
router.post('/', createAsset);
router.put('/:id', updateAsset);

module.exports = { router };
