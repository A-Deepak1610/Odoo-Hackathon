const { Router } = require('express');
const { getCategories } = require('../controllers/categories.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

router.use(authenticateJWT);
router.get('/', getCategories);

module.exports = { router };
