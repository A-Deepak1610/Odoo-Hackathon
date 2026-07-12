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
 * Get all allocations for managers/admins
 */
const getAllocations = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const allocations = await prisma.allocation.findMany({
      where: { organizationId: orgId },
      include: {
        asset: true,
        toEmployee: true,
        fromEmployee: true,
        toDepartment: true,
        requestedBy: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return successResponse(res, 200, 'Allocations retrieved successfully', allocations);
  } catch (error) {
    next(error);
  }
};

/**
 * Allocate asset directly (ASSET_MANAGER / ADMIN)
 */
const allocateAsset = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orgId = req.user.organizationId;
    const { assetId, toEmployeeId, toDepartmentId, expectedReturnDate } = req.body;

    if (!assetId) throw new ApiError(400, 'Asset ID is required');
    if (!toEmployeeId && !toDepartmentId) throw new ApiError(400, 'Employee or Department is required');

    // Check if asset exists and is available
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) throw new ApiError(404, 'Asset not found');

    if (asset.status === 'ALLOCATED') {
      throw new ApiError(400, 'Asset is already allocated');
    }
    if (asset.status !== 'AVAILABLE') {
      throw new ApiError(400, `Asset cannot be allocated because its status is ${asset.status}`);
    }

    const allocation = await prisma.$transaction(async (tx) => {
      // Create allocation record
      const record = await tx.allocation.create({
        data: {
          organizationId: orgId || asset.organizationId,
          assetId,
          toEmployeeId,
          toDepartmentId,
          requestedById: userId,
          approvedById: userId,
          status: 'ACTIVE',
          expectedReturnDate: expectedReturnDate ? new Date(expectedReturnDate) : null
        },
        include: { asset: true, toEmployee: true, toDepartment: true }
      });

      // Update asset status and holder
      await tx.asset.update({
        where: { id: assetId },
        data: {
          status: 'ALLOCATED',
          currentEmployeeId: toEmployeeId || null,
          currentDepartmentId: toDepartmentId || null
        }
      });

      return record;
    });

    return successResponse(res, 201, 'Asset allocated successfully', allocation);
  } catch (error) {
    next(error);
  }
};

/**
 * Return an asset (Check-in)
 */
const returnAsset = async (req, res, next) => {
  try {
    const { id } = req.params; // Allocation ID
    const { condition, checkInNotes } = req.body;

    const allocation = await prisma.allocation.findUnique({
      where: { id },
      include: { asset: true }
    });

    if (!allocation) throw new ApiError(404, 'Allocation not found');
    if (allocation.status !== 'ACTIVE') throw new ApiError(400, 'Only ACTIVE allocations can be returned');

    const updatedAllocation = await prisma.$transaction(async (tx) => {
      const record = await tx.allocation.update({
        where: { id },
        data: {
          status: 'RETURNED',
          returnedDate: new Date(),
          checkInNotes
        }
      });

      await tx.asset.update({
        where: { id: allocation.assetId },
        data: {
          status: 'AVAILABLE',
          condition: condition || allocation.asset.condition,
          currentEmployeeId: null,
          currentDepartmentId: null
        }
      });

      return record;
    });

    return successResponse(res, 200, 'Asset returned successfully', updatedAllocation);
  } catch (error) {
    next(error);
  }
};

/**
 * Approve a transfer request
 */
const approveTransfer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const allocation = await prisma.allocation.findUnique({ where: { id } });
    if (!allocation) throw new ApiError(404, 'Transfer request not found');
    if (allocation.status !== 'PENDING') throw new ApiError(400, 'Only PENDING transfers can be approved');

    const approved = await prisma.$transaction(async (tx) => {
      const record = await tx.allocation.update({
        where: { id },
        data: {
          status: 'ACTIVE',
          approvedById: userId
        }
      });

      // Close any previous ACTIVE allocation for this asset
      await tx.allocation.updateMany({
        where: { assetId: allocation.assetId, status: 'ACTIVE', id: { not: id } },
        data: { status: 'RETURNED', returnedDate: new Date() }
      });

      await tx.asset.update({
        where: { id: allocation.assetId },
        data: {
          currentEmployeeId: allocation.toEmployeeId,
          currentDepartmentId: allocation.toDepartmentId
        }
      });

      return record;
    });

    return successResponse(res, 200, 'Transfer approved successfully', approved);
  } catch (error) {
    next(error);
  }
};

/**
 * Reject a transfer request
 */
const rejectTransfer = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const allocation = await prisma.allocation.findUnique({ where: { id } });
    if (!allocation) throw new ApiError(404, 'Transfer request not found');
    if (allocation.status !== 'PENDING') throw new ApiError(400, 'Only PENDING transfers can be rejected');

    const rejected = await prisma.allocation.update({
      where: { id },
      data: { status: 'REJECTED' }
    });

    return successResponse(res, 200, 'Transfer rejected successfully', rejected);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyTransfers,
  requestTransfer,
  cancelTransferRequest,
  getAllocations,
  allocateAsset,
  returnAsset,
  approveTransfer,
  rejectTransfer
};
