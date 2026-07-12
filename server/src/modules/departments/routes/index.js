const { Router } = require('express');
const { getDepartments } = require('../controllers/departments.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();
router.use(authenticateJWT);
router.get('/', getDepartments);

module.exports = { router };
