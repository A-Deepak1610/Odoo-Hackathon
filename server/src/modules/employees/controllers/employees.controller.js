const { prisma } = require('../../../core/database/prisma');
const { successResponse } = require('../../../core/response/apiResponse');

const getEmployees = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const employees = await prisma.user.findMany({
      where: { organizationId: orgId, isActive: true },
      include: { department: true }
    });
    return successResponse(res, 200, 'Employees retrieved', employees);
  } catch (error) {
    next(error);
  }
};

module.exports = { getEmployees };
