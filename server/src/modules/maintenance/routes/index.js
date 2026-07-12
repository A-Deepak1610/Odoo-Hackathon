const { Router } = require('express');
const { 
  getMyRequests,
  raiseRequest
} = require('../controllers/maintenance.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

// Secure all maintenance routes
router.use(authenticateJWT);

router.get('/my-requests', getMyRequests);
router.post('/', raiseRequest);

module.exports = { router };
