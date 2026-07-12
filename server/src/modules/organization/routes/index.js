const { Router } = require('express');
const { getOrganizationDetails } = require('../controllers/organization.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

router.use(authenticateJWT);
router.get('/', getOrganizationDetails);

module.exports = { router };
