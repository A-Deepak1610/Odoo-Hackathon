const { Router } = require('express');
const { getCategories, createCategory } = require('../controllers/categories.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

router.use(authenticateJWT);

router.get('/', getCategories);
router.post('/', createCategory);

module.exports = { router };
