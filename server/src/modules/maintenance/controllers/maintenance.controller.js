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

/**
 * Get all maintenance requests (Admins/Managers)
 */
const getAllRequests = async (req, res, next) => {
  try {
    const requests = await prisma.maintenanceRequest.findMany({
      include: { 
        asset: true,
        requestedBy: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return successResponse(res, 200, 'All maintenance requests retrieved successfully', requests);
  } catch (error) {
    next(error);
  }
};

/**
 * Approve a maintenance request (flips asset status to UNDER_MAINTENANCE)
 */
const approveRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const request = await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: { asset: true }
    });

    if (!request) {
      throw new ApiError(404, 'Maintenance request not found');
    }

    if (request.status !== 'PENDING') {
      throw new ApiError(400, `Cannot approve request with status: ${request.status}`);
    }

    // 1. Update request status to APPROVED
    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedById: adminId
      },
      include: { asset: true }
    });

    // 2. Update asset status to UNDER_MAINTENANCE
    await prisma.asset.update({
      where: { id: request.assetId },
      data: {
        status: 'UNDER_MAINTENANCE'
      }
    });

    return successResponse(res, 200, 'Maintenance request approved. Asset has been placed Under Maintenance.', updatedRequest);
  } catch (error) {
    next(error);
  }
};

/**
 * Resolve a maintenance request (restores asset status back to AVAILABLE or ALLOCATED)
 */
const resolveRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: { asset: true }
    });

    if (!request) {
      throw new ApiError(404, 'Maintenance request not found');
    }

    if (request.status !== 'APPROVED' && request.status !== 'IN_PROGRESS' && request.status !== 'PENDING') {
      throw new ApiError(400, `Cannot resolve request with status: ${request.status}`);
    }

    // 1. Update request status to RESOLVED
    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date()
      },
      include: { asset: true }
    });

    // 2. Flip asset back to ALLOCATED if assigned to user, otherwise AVAILABLE
    const nextStatus = request.asset.currentEmployeeId ? 'ALLOCATED' : 'AVAILABLE';
    await prisma.asset.update({
      where: { id: request.assetId },
      data: {
        status: nextStatus
      }
    });

    return successResponse(res, 200, `Maintenance request resolved. Asset status restored to ${nextStatus}.`, updatedRequest);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyRequests,
  raiseRequest,
  getAllRequests,
  approveRequest,
  resolveRequest
};
