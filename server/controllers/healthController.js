const getHealth = (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    uptime: process.uptime(),
  })
}

module.exports = {
  getHealth,
}
