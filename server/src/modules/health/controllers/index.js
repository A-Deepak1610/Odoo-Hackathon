const { successResponse } = require('../../../core/response/apiResponse');

const checkHealth = (req, res) => {
  const data = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  };
  return successResponse(res, 200, 'Server is healthy', data);
};

module.exports = {
  checkHealth,
};
