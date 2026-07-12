const { Router } = require('express');
const { 
  getMyTransfers,
  requestTransfer,
  cancelTransferRequest,
  getDepartmentRequests,
  approveRequest,
  rejectRequest
} = require('../controllers/allocation.controller');
const { authenticateJWT, authorizeRoles } = require('../../auth/middlewares/auth.middleware');

const router = Router();

// Secure all allocation/transfer routes
router.use(authenticateJWT);

router.get('/my-transfers', getMyTransfers);
router.post('/transfer', requestTransfer);
router.put('/transfer/:id/cancel', cancelTransferRequest);

// Department Head Routes
router.get('/department', authorizeRoles('DEPARTMENT_HEAD'), getDepartmentRequests);
router.put('/:id/approve', authorizeRoles('DEPARTMENT_HEAD', 'SUPERADMIN'), approveRequest);
router.put('/:id/reject', authorizeRoles('DEPARTMENT_HEAD', 'SUPERADMIN'), rejectRequest);

module.exports = { router };
