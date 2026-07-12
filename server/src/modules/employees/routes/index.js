const { Router } = require('express');
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

module.exports = { router };
