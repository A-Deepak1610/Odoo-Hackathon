const { prisma } = require('../../../core/database/prisma');
const { successResponse } = require('../../../core/response/apiResponse');
const { ApiError } = require('../../../core/errors/ApiError');

/**
 * Get all transfer requests involving the logged-in employee
 */
const getMyTransfers = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transfers = await prisma.allocation.findMany({
      where: {
        OR: [
          { requestedById: userId },
          { toEmployeeId: userId },
          { fromEmployeeId: userId }
        ]
      },
      include: {
        asset: true,
        toEmployee: {
          select: { id: true, name: true, email: true }
        },
        fromEmployee: {
          select: { id: true, name: true, email: true }
        },
        toDepartment: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return successResponse(res, 200, 'Transfer requests retrieved successfully', transfers);
  } catch (error) {
    next(error);
  }
};

/**
 * Request transfer of an allocated asset
 */
const requestTransfer = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orgId = req.user.organizationId;
    const { assetId, toEmployeeId, toDepartmentId, reason } = req.body;

    if (!assetId) {
      throw new ApiError(400, 'Asset ID is required');
    }
    if (!reason || reason.trim() === '') {
      throw new ApiError(400, 'Reason for transfer is required');
    }

    if (!toEmployeeId && !toDepartmentId) {
      throw new ApiError(400, 'Either a destination employee or department must be specified');
    }

    // 1. Verify the asset is currently allocated to the employee
    const asset = await prisma.asset.findUnique({
      where: { id: assetId }
    });

    if (!asset) {
      throw new ApiError(404, 'Asset not found');
    }

    if (asset.currentEmployeeId !== userId) {
      throw new ApiError(400, 'You can only request transfer for assets currently assigned to you');
    }

    // 2. Check if a pending transfer already exists for this asset
    const existingPending = await prisma.allocation.findFirst({
      where: {
        assetId,
        status: 'PENDING'
      }
    });

    if (existingPending) {
      throw new ApiError(400, 'A pending transfer request already exists for this asset');
    }

    // 3. Create the transfer request
    const transfer = await prisma.allocation.create({
      data: {
        organizationId: orgId || asset.organizationId,
        assetId,
        fromEmployeeId: userId,
        toEmployeeId: toEmployeeId || null,
        toDepartmentId: toDepartmentId || null,
        requestedById: userId,
        status: 'PENDING',
        checkInNotes: reason // Reason saved in checkInNotes
      },
      include: {
        asset: true,
        toEmployee: true,
        toDepartment: true
      }
    });

    return successResponse(res, 201, 'Transfer request submitted successfully', transfer);
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel a pending transfer request
 */
const cancelTransferRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const transfer = await prisma.allocation.findUnique({
      where: { id }
    });

    if (!transfer) {
      throw new ApiError(404, 'Transfer request not found');
    }

    if (transfer.requestedById !== userId) {
      throw new ApiError(403, 'You do not have permission to cancel this transfer request');
    }

    if (transfer.status !== 'PENDING') {
      throw new ApiError(400, 'You can only cancel pending transfer requests');
    }

    // Delete the pending allocation request record
    await prisma.allocation.delete({
      where: { id }
    });

    return successResponse(res, 200, 'Transfer request cancelled successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all allocations in the organization (Admin only)
 */
const getAllAllocations = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const whereClause = orgId ? { organizationId: orgId } : {};

    const allocations = await prisma.allocation.findMany({
      where: whereClause,
      include: {
        asset: true,
        toEmployee: {
          select: { id: true, name: true, email: true }
        },
        fromEmployee: {
          select: { id: true, name: true, email: true }
        },
        toDepartment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return successResponse(res, 200, 'All allocations retrieved successfully', allocations);
  } catch (error) {
    next(error);
  }
};

/**
 * Approve a pending transfer request
 */
const approveTransfer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const transfer = await prisma.allocation.findUnique({
      where: { id },
      include: { asset: true }
    });

    if (!transfer) {
      throw new ApiError(404, 'Transfer request not found');
    }

    if (transfer.status !== 'PENDING') {
      throw new ApiError(400, 'Only pending transfer requests can be approved');
    }

    // Update the transfer status
    const updatedTransfer = await prisma.allocation.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedById: adminId,
        returnedDate: new Date() // Mark the actual transfer date
      }
    });

    // Update the asset owner
    await prisma.asset.update({
      where: { id: transfer.assetId },
      data: {
        currentEmployeeId: transfer.toEmployeeId || null,
        currentDepartmentId: transfer.toDepartmentId || null,
        status: 'ALLOCATED'
      }
    });

    return successResponse(res, 200, 'Transfer request approved and asset reassigned successfully', updatedTransfer);
  } catch (error) {
    next(error);
  }
};

/**
 * Reject a pending transfer request
 */
const rejectTransfer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const transfer = await prisma.allocation.findUnique({
      where: { id }
    });

    if (!transfer) {
      throw new ApiError(404, 'Transfer request not found');
    }

    if (transfer.status !== 'PENDING') {
      throw new ApiError(400, 'Only pending transfer requests can be rejected');
    }

    const updatedTransfer = await prisma.allocation.update({
      where: { id },
      data: {
        status: 'REJECTED',
        approvedById: adminId
      }
    });

    return successResponse(res, 200, 'Transfer request rejected successfully', updatedTransfer);
  } catch (error) {
    next(error);
  }
};

/**
 * Force return an asset (de-allocate)
 */
const forceReturn = async (req, res, next) => {
  try {
    const { assetId } = req.body;
    const adminId = req.user.id;

    const asset = await prisma.asset.findUnique({
      where: { id: assetId }
    });

    if (!asset) {
      throw new ApiError(404, 'Asset not found');
    }

    // 1. Update active allocations to completed/returned
    await prisma.allocation.updateMany({
      where: {
        assetId,
        status: 'ACTIVE'
      },
      data: {
        status: 'RETURNED',
        returnedDate: new Date(),
        approvedById: adminId
      }
    });

    // 2. Update asset status to available and clear custodians
    const updatedAsset = await prisma.asset.update({
      where: { id: assetId },
      data: {
        status: 'AVAILABLE',
        currentEmployeeId: null,
        currentDepartmentId: null
      }
    });

    return successResponse(res, 200, 'Asset returned and marked as available', updatedAsset);
  } catch (error) {
    next(error);
  }
};

/**
 * Allocate/Assign an asset directly (Admin only)
 */
const assignAsset = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    let orgId = req.user.organizationId;
    if (!orgId) {
      const firstOrg = await prisma.organization.findFirst();
      orgId = firstOrg?.id;
    }

    const { assetId, toEmployeeId, toDepartmentId } = req.body;

    if (!assetId) {
      throw new ApiError(400, 'Asset ID is required');
    }
    if (!toEmployeeId && !toDepartmentId) {
      throw new ApiError(400, 'Must specify either employee or department to assign');
    }

    const asset = await prisma.asset.findUnique({
      where: { id: assetId }
    });

    if (!asset) {
      throw new ApiError(404, 'Asset not found');
    }

    // Create a new allocation record
    const allocation = await prisma.allocation.create({
      data: {
        organizationId: orgId,
        assetId,
        toEmployeeId: toEmployeeId || null,
        toDepartmentId: toDepartmentId || null,
        requestedById: adminId,
        approvedById: adminId,
        status: 'ACTIVE',
        expectedReturnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days default
      }
    });

    // Update asset
    await prisma.asset.update({
      where: { id: assetId },
      data: {
        status: 'ALLOCATED',
        currentEmployeeId: toEmployeeId || null,
        currentDepartmentId: toDepartmentId || null
      }
    });

    return successResponse(res, 201, 'Asset assigned successfully', allocation);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyTransfers,
  requestTransfer,
  cancelTransferRequest,
  getAllAllocations,
  approveTransfer,
  rejectTransfer,
  forceReturn,
  assignAsset
};
