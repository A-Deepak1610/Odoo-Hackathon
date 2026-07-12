const { Router } = require('express');
const { checkHealth } = require('../controllers');

const router = Router();

router.get('/', checkHealth);

module.exports = { router };
