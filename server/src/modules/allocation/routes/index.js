const { Router } = require('express');
const { 
  getMyTransfers,
  requestTransfer,
  cancelTransferRequest
} = require('../controllers/allocation.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

// Secure all allocation/transfer routes
router.use(authenticateJWT);

router.get('/my-transfers', getMyTransfers);
router.post('/transfer', requestTransfer);
router.put('/transfer/:id/cancel', cancelTransferRequest);

module.exports = { router };
