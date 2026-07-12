const router = require('express').Router()

const { getHealth } = require('../controllers/healthController')

router.get('/health', getHealth)

module.exports = router
