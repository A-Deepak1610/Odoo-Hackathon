const { Router } = require('express');
const { 
  getMyTransfers,
  requestTransfer,
  cancelTransferRequest,
  getAllocations,
  allocateAsset,
  returnAsset,
  approveTransfer,
  rejectTransfer
} = require('../controllers/allocation.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

// Secure all allocation/transfer routes
router.use(authenticateJWT);

// Employee endpoints
router.get('/my-transfers', getMyTransfers);
router.post('/transfer', requestTransfer);
router.put('/transfer/:id/cancel', cancelTransferRequest);

// Manager/Admin endpoints
router.get('/', getAllocations);
router.post('/', allocateAsset);
router.put('/:id/return', returnAsset);
router.put('/transfer/:id/approve', approveTransfer);
router.put('/transfer/:id/reject', rejectTransfer);

module.exports = { router };
