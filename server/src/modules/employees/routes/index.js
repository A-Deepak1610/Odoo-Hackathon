const { Router } = require('express');
const { getEmployees } = require('../controllers/employees.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();
router.use(authenticateJWT);
router.get('/', getEmployees);

module.exports = { router };
