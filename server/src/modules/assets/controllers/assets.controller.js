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
 * Get single asset by ID
 */
const getAssetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: { category: true, currentDepartment: true, currentEmployee: true }
    });

    if (!asset) {
      throw new ApiError(404, 'Asset not found');
    }

    return successResponse(res, 200, 'Asset retrieved successfully', asset);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new asset (ASSET_MANAGER or ADMIN)
 */
const createAsset = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    if (!orgId) throw new ApiError(400, 'User must belong to an organization');

    const {
      name, serialNumber, categoryId, acquisitionDate, acquisitionCost,
      condition, location, isSharedBookable
    } = req.body;

    if (!name || !categoryId) {
      throw new ApiError(400, 'Name and categoryId are required');
    }

    // Auto-generate Asset Tag
    const assetCount = await prisma.asset.count({ where: { organizationId: orgId } });
    const assetTag = `AF-${String(assetCount + 1).padStart(4, '0')}`;

    const asset = await prisma.asset.create({
      data: {
        organizationId: orgId,
        name,
        assetTag,
        serialNumber,
        categoryId,
        acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null,
        acquisitionCost: acquisitionCost ? parseFloat(acquisitionCost) : null,
        condition,
        location,
        isSharedBookable: !!isSharedBookable,
        status: 'AVAILABLE'
      },
      include: { category: true }
    });

    return successResponse(res, 201, 'Asset created successfully', asset);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing asset
 */
const updateAsset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name, serialNumber, categoryId, acquisitionDate, acquisitionCost,
      condition, location, isSharedBookable, status
    } = req.body;

    const existingAsset = await prisma.asset.findUnique({ where: { id } });
    if (!existingAsset) {
      throw new ApiError(404, 'Asset not found');
    }

    const updatedAsset = await prisma.asset.update({
      where: { id },
      data: {
        name,
        serialNumber,
        categoryId,
        acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : undefined,
        acquisitionCost: acquisitionCost !== undefined ? parseFloat(acquisitionCost) : undefined,
        condition,
        location,
        isSharedBookable: isSharedBookable !== undefined ? !!isSharedBookable : undefined,
        status: status || undefined
      },
      include: { category: true, currentDepartment: true, currentEmployee: true }
    });

    return successResponse(res, 200, 'Asset updated successfully', updatedAsset);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssets,
  getMyAssets,
  getAssetById,
  createAsset,
  updateAsset
};
