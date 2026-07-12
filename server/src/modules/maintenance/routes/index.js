const { Router } = require('express');
const { 
  getMyRequests,
  raiseRequest,
  getAllRequests,
  approveRequest,
  resolveRequest
} = require('../controllers/maintenance.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

// Secure all maintenance routes
router.use(authenticateJWT);

router.get('/my-requests', getMyRequests);
router.post('/', raiseRequest);

// Administrative routes
router.get('/', getAllRequests);
router.put('/:id/approve', approveRequest);
router.put('/:id/resolve', resolveRequest);

module.exports = { router };
