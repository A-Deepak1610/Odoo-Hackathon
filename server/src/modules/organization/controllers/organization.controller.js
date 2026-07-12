const { prisma } = require('../../../core/database/prisma');
const { successResponse } = require('../../../core/response/apiResponse');

/**
 * Get organization users and departments
 */
const getOrganizationDetails = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const whereClause = orgId ? { organizationId: orgId } : {};

    const users = await prisma.user.findMany({
      where: { 
        ...whereClause,
        isActive: true
      },
      select: { id: true, name: true, email: true }
    });

    const departments = await prisma.department.findMany({
      where: { 
        ...whereClause,
        isActive: true
      }
    });

    return successResponse(res, 200, 'Organization details retrieved successfully', { users, departments });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrganizationDetails
};
