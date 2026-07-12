const { Router } = require('express');
const { 
  getBookableResources,
  getBookings,
  createBooking,
  cancelBooking,
  rescheduleBooking
} = require('../controllers/bookings.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

// Secure all booking routes
router.use(authenticateJWT);

router.get('/', getBookings);
router.post('/', createBooking);
router.get('/resources', getBookableResources);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/reschedule', rescheduleBooking);

module.exports = { router };
