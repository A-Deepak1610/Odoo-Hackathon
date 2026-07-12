const { Router } = require('express');
<<<<<<< HEAD
const { getCategories } = require('../controllers/categories.controller');
=======
const { getCategories, createCategory } = require('../controllers/categories.controller');
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

router.use(authenticateJWT);
<<<<<<< HEAD
router.get('/', getCategories);
=======

router.get('/', getCategories);
router.post('/', createCategory);
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1

module.exports = { router };
