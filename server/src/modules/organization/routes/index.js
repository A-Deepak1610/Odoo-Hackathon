const { Router } = require('express');
const { getOrganizationDetails } = require('../controllers/organization.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

// Secure all organization routes
router.use(authenticateJWT);
<<<<<<< HEAD
=======

>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
router.get('/', getOrganizationDetails);

module.exports = { router };
