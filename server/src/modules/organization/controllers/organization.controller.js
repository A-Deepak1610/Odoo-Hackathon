const { prisma } = require('../../../core/database/prisma');
const { successResponse } = require('../../../core/response/apiResponse');

const getOrganizationDetails = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true
      }
    });

    return successResponse(res, 200, 'Organization details retrieved successfully', {
      users,
      departments
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrganizationDetails
};
