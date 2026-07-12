const { Router } = require('express');
const { 
  getMyTransfers,
  requestTransfer,
  cancelTransferRequest,
  getAllAllocations,
  approveTransfer,
  rejectTransfer,
  forceReturn,
  assignAsset
} = require('../controllers/allocation.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

// Secure all allocation/transfer routes
router.use(authenticateJWT);

// Employee routes
// Employee endpoints
router.get('/my-transfers', getMyTransfers);
router.post('/transfer', requestTransfer);
router.put('/transfer/:id/cancel', cancelTransferRequest);

// Admin routes
router.get('/', getAllAllocations);
router.put('/transfer/:id/approve', approveTransfer);
router.put('/transfer/:id/reject', rejectTransfer);
router.post('/force-return', forceReturn);
router.post('/assign', assignAsset)

module.exports = { router };
