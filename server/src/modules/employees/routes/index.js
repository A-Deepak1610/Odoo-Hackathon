const { Router } = require('express');
<<<<<<< HEAD
const { 
  getEmployees, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee 
} = require('../controllers/employees.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();

// Secure all employee routes
router.use(authenticateJWT);

router.get('/', getEmployees);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
=======
const { getEmployees } = require('../controllers/employees.controller');
const { authenticateJWT } = require('../../auth/middlewares/auth.middleware');

const router = Router();
router.use(authenticateJWT);
router.get('/', getEmployees);
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1

module.exports = { router };
