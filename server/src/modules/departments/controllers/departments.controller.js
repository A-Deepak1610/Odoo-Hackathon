const { prisma } = require('../../../core/database/prisma');
const { successResponse } = require('../../../core/response/apiResponse');

const getDepartments = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const departments = await prisma.department.findMany({
      where: { organizationId: orgId, isActive: true },
    });
    return successResponse(res, 200, 'Departments retrieved', departments);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDepartments };
