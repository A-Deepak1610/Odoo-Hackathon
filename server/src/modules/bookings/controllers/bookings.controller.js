const { prisma } = require('../../../core/database/prisma');
const { successResponse } = require('../../../core/response/apiResponse');
const { ApiError } = require('../../../core/errors/ApiError');

/**
 * Get all assets that are shared bookable
 */
const getBookableResources = async (req, res, next) => {
  try {
    const resources = await prisma.asset.findMany({
      where: { 
        isSharedBookable: true,
        status: { not: 'RETIRED' }
      },
      include: { category: true }
    });
    return successResponse(res, 200, 'Bookable resources retrieved successfully', resources);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all bookings for the active employee
 */
const getBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookings = await prisma.resourceBooking.findMany({
      where: { bookedByEmployeeId: userId },
      include: { asset: true, bookedByEmployee: { select: { id: true, name: true, email: true } } },
      orderBy: { startTime: 'desc' },
    });
    return successResponse(res, 200, 'Booking history retrieved successfully', bookings);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all bookings across the organization (for managers/admins)
 */
const getAllBookings = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const bookings = await prisma.resourceBooking.findMany({
      where: { organizationId: orgId },
      include: { asset: true, bookedByEmployee: { select: { id: true, name: true, email: true } } },
      orderBy: { startTime: 'desc' },
    });
    return successResponse(res, 200, 'All organization bookings retrieved successfully', bookings);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new resource booking
 */
const createBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orgId = req.user.organizationId;
    const { assetId, startTime, endTime } = req.body;

    if (!assetId || !startTime || !endTime) {
      throw new ApiError(400, 'Asset ID, start time, and end time are required');
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new ApiError(400, 'Invalid date format');
    }

    if (start < new Date()) {
      throw new ApiError(400, 'Booking start time must be in the future');
    }

    if (end <= start) {
      throw new ApiError(400, 'End time must be after start time');
    }

    // 1. Verify resource exists, is shared bookable, and not retired
    const asset = await prisma.asset.findUnique({
      where: { id: assetId }
    });

    if (!asset) {
      throw new ApiError(404, 'Resource not found');
    }

    if (!asset.isSharedBookable) {
      throw new ApiError(400, 'This resource is not available for shared booking');
    }

    if (asset.status === 'RETIRED') {
      throw new ApiError(400, 'This resource is retired and cannot be booked');
    }

    // 2. Prevent overlapping bookings
    const overlap = await prisma.resourceBooking.findFirst({
      where: {
        assetId,
        status: { not: 'CANCELLED' },
        startTime: { lt: end },
        endTime: { gt: start }
      }
    });

    if (overlap) {
      throw new ApiError(400, 'This resource is already booked during the selected timeslot');
    }

    // 3. Create reservation
    const booking = await prisma.resourceBooking.create({
      data: {
        organizationId: orgId || asset.organizationId,
        assetId,
        bookedByEmployeeId: userId,
        startTime: start,
        endTime: end,
        status: 'UPCOMING'
      },
      include: { asset: true }
    });

    return successResponse(res, 201, 'Resource booked successfully', booking);
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel a pending or upcoming booking
 */
const cancelBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const booking = await prisma.resourceBooking.findUnique({
      where: { id }
    });

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    // Allow owner or admins to cancel
    if (booking.bookedByEmployeeId !== userId && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'You do not have permission to cancel this booking');
    }

    const updatedBooking = await prisma.resourceBooking.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    return successResponse(res, 200, 'Booking cancelled successfully', updatedBooking);
  } catch (error) {
    next(error);
  }
};

/**
 * Reschedule an existing booking
 */
const rescheduleBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { startTime, endTime } = req.body;

    if (!startTime || !endTime) {
      throw new ApiError(400, 'Start time and end time are required');
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new ApiError(400, 'Invalid date format');
    }

    if (start < new Date()) {
      throw new ApiError(400, 'Rescheduled start time must be in the future');
    }

    if (end <= start) {
      throw new ApiError(400, 'End time must be after start time');
    }

    const booking = await prisma.resourceBooking.findUnique({
      where: { id }
    });

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (booking.bookedByEmployeeId !== userId && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'You do not have permission to reschedule this booking');
    }

    // Check for overlap, excluding this booking itself
    const overlap = await prisma.resourceBooking.findFirst({
      where: {
        assetId: booking.assetId,
        id: { not: id },
        status: { not: 'CANCELLED' },
        startTime: { lt: end },
        endTime: { gt: start }
      }
    });

    if (overlap) {
      throw new ApiError(400, 'This resource is already booked during the selected rescheduled timeslot');
    }

    const updatedBooking = await prisma.resourceBooking.update({
      where: { id },
      data: {
        startTime: start,
        endTime: end,
        status: 'UPCOMING' // Reset status to upcoming if it was ongoing/ended
      },
      include: { asset: true }
    });

    return successResponse(res, 200, 'Booking rescheduled successfully', updatedBooking);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookableResources,
  getBookings,
  getAllBookings,
  createBooking,
  cancelBooking,
  rescheduleBooking
};
