const { Router } = require('express');
<<<<<<< HEAD
const { getAssets, getMyAssets, createAsset, deleteAsset } = require('../controllers/assets.controller');
=======
const { getAssets, getMyAssets, getAssetById, createAsset, updateAsset } = require('../controllers/assets.controller');
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

// Secure all assets routes
router.use(authenticateJWT);

router.get('/', getAssets);
router.get('/my', getMyAssets);
<<<<<<< HEAD
router.post('/', createAsset);
router.delete('/:id', deleteAsset);
=======
router.get('/:id', getAssetById);
router.post('/', createAsset);
router.put('/:id', updateAsset);
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1

module.exports = { router };
