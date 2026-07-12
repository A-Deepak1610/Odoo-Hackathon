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

/**
 * Create a new asset
 */
const createAsset = async (req, res, next) => {
  try {
    let orgId = req.user.organizationId;
    if (!orgId) {
      const firstOrg = await prisma.organization.findFirst();
      orgId = firstOrg?.id;
    }
    const { name, assetTag, serialNumber, categoryId, condition, location, isSharedBookable } = req.body;

    if (!name || !assetTag || !categoryId) {
      throw new ApiError(400, 'Name, assetTag, and categoryId are required');
    }

    // Check if assetTag is unique within organization
    const existing = await prisma.asset.findFirst({
      where: {
        organizationId: orgId,
        assetTag
      }
    });

    if (existing) {
      throw new ApiError(400, `Asset with tag ${assetTag} already exists`);
    }

    const asset = await prisma.asset.create({
      data: {
        organizationId: orgId,
        name,
        assetTag,
        serialNumber,
        categoryId,
        condition: condition || 'New',
        location,
        isSharedBookable: isSharedBookable || false,
        status: 'AVAILABLE'
      },
      include: {
        category: true
      }
    });

    return successResponse(res, 201, 'Asset registered successfully', asset);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an asset
 */
const deleteAsset = async (req, res, next) => {
  try {
    const { id } = req.params;

    const asset = await prisma.asset.findUnique({
      where: { id }
    });

    if (!asset) {
      throw new ApiError(404, 'Asset not found');
    }

    await prisma.asset.delete({
      where: { id }
    });

    return successResponse(res, 200, 'Asset deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssets,
  getMyAssets,
  createAsset,
  deleteAsset
};
