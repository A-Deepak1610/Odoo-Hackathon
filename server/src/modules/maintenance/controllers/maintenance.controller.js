const { prisma } = require('../../../core/database/prisma');
const { successResponse } = require('../../../core/response/apiResponse');
const { ApiError } = require('../../../core/errors/ApiError');

/**
 * Get all maintenance requests submitted by the logged-in employee
 */
const getMyRequests = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const requests = await prisma.maintenanceRequest.findMany({
      where: { requestedById: userId },
      include: { asset: true },
      orderBy: { createdAt: 'desc' }
    });
    return successResponse(res, 200, 'Maintenance requests retrieved successfully', requests);
  } catch (error) {
    next(error);
  }
};

/**
 * Raise a new maintenance request for an assigned asset
 */
const raiseRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orgId = req.user.organizationId;
    const { assetId, description, priority, photoUrl } = req.body;

    if (!assetId || !description || description.trim() === '') {
      throw new ApiError(400, 'Asset ID and issue description are required');
    }

    // Check if priority is valid
    const allowedPriorities = ['LOW', 'MEDIUM', 'HIGH'];
    const pVal = (priority || 'MEDIUM').toUpperCase();
    if (!allowedPriorities.includes(pVal)) {
      throw new ApiError(400, 'Priority must be LOW, MEDIUM, or HIGH');
    }

    // 1. Verify the asset is assigned to the user
    const asset = await prisma.asset.findUnique({
      where: { id: assetId }
    });

    if (!asset) {
      throw new ApiError(404, 'Asset not found');
    }

    if (asset.currentEmployeeId !== userId) {
      throw new ApiError(400, 'You can only report issues for assets currently assigned to you');
    }

    // 2. Create the maintenance request
    const request = await prisma.maintenanceRequest.create({
      data: {
        organizationId: orgId || asset.organizationId,
        assetId,
        requestedById: userId,
        description,
        priority: pVal,
        photoUrl: photoUrl || null,
        status: 'PENDING'
      },
      include: { asset: true }
    });

    return successResponse(res, 201, 'Maintenance request submitted successfully', request);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyRequests,
  raiseRequest
};
