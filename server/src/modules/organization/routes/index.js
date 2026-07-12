const { Router } = require('express');
const { getOrganizationDetails } = require('../controllers/organization.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

// Secure all organization routes
router.use(authenticateJWT);
<<<<<<< HEAD
=======

>>>>>>> c6229ab (resolved bug in imports)
router.get('/', getOrganizationDetails);

module.exports = { router };
