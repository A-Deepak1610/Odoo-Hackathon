const { prisma } = require('../../../core/database/prisma');
const { successResponse } = require('../../../core/response/apiResponse');
const { ApiError } = require('../../../core/errors/ApiError');

/**
 * Get assets (role-based)
 */
const getAssets = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    if (role === 'EMPLOYEE') {
      // Employees only view their assigned assets
      const assets = await prisma.asset.findMany({
        where: { currentEmployeeId: userId },
        include: { category: true, currentDepartment: true }
      });
      return successResponse(res, 200, 'Assigned assets retrieved successfully', assets);
    } else {
      // Admins/Managers view all assets
      const assets = await prisma.asset.findMany({
        include: { category: true, currentDepartment: true, currentEmployee: true }
      });
      return successResponse(res, 200, 'All assets retrieved successfully', assets);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get assigned assets only
 */
const getMyAssets = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const assets = await prisma.asset.findMany({
      where: { currentEmployeeId: userId },
      include: { category: true, currentDepartment: true }
    });
    return successResponse(res, 200, 'My assets retrieved successfully', assets);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssets,
  getMyAssets
};
