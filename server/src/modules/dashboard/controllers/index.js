const { prisma } = require('../../../core/database/prisma');
const { successResponse } = require('../../../core/response/apiResponse');
const { ApiError } = require('../../../core/errors/ApiError');

/**
 * Get personalized employee dashboard metrics
 */
const getEmployeeDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // 1. Fetch Counts
    const myAssetsCount = await prisma.asset.count({
      where: { currentEmployeeId: userId },
    });

    const activeBookingsCount = await prisma.resourceBooking.count({
      where: {
        bookedByEmployeeId: userId,
        status: { in: ['UPCOMING', 'ONGOING'] },
      },
    });

    const pendingMaintenanceCount = await prisma.maintenanceRequest.count({
      where: {
        requestedById: userId,
        status: { in: ['PENDING', 'APPROVED', 'IN_PROGRESS'] },
      },
    });

    const pendingTransfersCount = await prisma.allocation.count({
      where: {
        status: 'PENDING',
        OR: [
          { requestedById: userId },
          { toEmployeeId: userId },
          { fromEmployeeId: userId },
        ],
      },
    });

    // 2. Fetch Detailed Sections
    const myAssets = await prisma.asset.findMany({
      where: { currentEmployeeId: userId },
      include: { category: true },
      take: 5,
    });

    const upcomingReturns = await prisma.allocation.findMany({
      where: {
        toEmployeeId: userId,
        status: 'ACTIVE',
        expectedReturnDate: { gte: now },
      },
      include: { asset: true },
      orderBy: { expectedReturnDate: 'asc' },
      take: 5,
    });

    const upcomingBookings = await prisma.resourceBooking.findMany({
      where: {
        bookedByEmployeeId: userId,
        startTime: { gte: now },
        status: { in: ['UPCOMING', 'ONGOING'] },
      },
      include: { asset: true },
      orderBy: { startTime: 'asc' },
      take: 5,
    });

    const maintenanceStatus = await prisma.maintenanceRequest.findMany({
      where: { requestedById: userId },
      include: { asset: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // 3. Compile Recent Activities
    const recentAllocations = await prisma.allocation.findMany({
      where: {
        OR: [
          { toEmployeeId: userId },
          { fromEmployeeId: userId },
        ],
      },
      include: { asset: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const recentBookings = await prisma.resourceBooking.findMany({
      where: { bookedByEmployeeId: userId },
      include: { asset: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const recentMaintenance = await prisma.maintenanceRequest.findMany({
      where: { requestedById: userId },
      include: { asset: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Merge and structure activities
    const activities = [];

    recentAllocations.forEach((alloc) => {
      const isRecipient = alloc.toEmployeeId === userId;
      activities.push({
        id: `alloc-${alloc.id}`,
        type: 'ALLOCATION',
        message: isRecipient 
          ? `Material Assigned: ${alloc.asset.name} (${alloc.asset.assetTag}) was assigned to you.`
          : `Material Transferred: ${alloc.asset.name} (${alloc.asset.assetTag}) was returned or transferred.`,
        date: alloc.createdAt,
        status: alloc.status,
      });
    });

    recentBookings.forEach((book) => {
      activities.push({
        id: `book-${book.id}`,
        type: 'BOOKING',
        message: `Resource Booked: ${book.asset.name} is scheduled starting ${new Date(book.startTime).toLocaleString()}.`,
        date: book.createdAt,
        status: book.status,
      });
    });

    recentMaintenance.forEach((maint) => {
      activities.push({
        id: `maint-${maint.id}`,
        type: 'MAINTENANCE',
        message: `Maintenance Raised: Issue reported on ${maint.asset.name} - "${maint.description.substring(0, 40)}${maint.description.length > 40 ? '...' : ''}".`,
        date: maint.createdAt,
        status: maint.status,
      });
    });

    // Sort activities by date descending
    const sortedActivities = activities
      .sort((a, b) => b.date - a.date)
      .slice(0, 10)
      .map(act => {
        // Calculate relative time string
        const diffMs = new Date() - new Date(act.date);
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        let timeStr = 'Just now';
        if (diffDays > 0) {
          timeStr = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffHours > 0) {
          timeStr = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffMins > 0) {
          timeStr = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        }

        return {
          ...act,
          time: timeStr,
        };
      });

    // Compile Dashboard data
    const dashboardData = {
      cards: {
        myAssetsCount,
        activeBookingsCount,
        pendingMaintenanceCount,
        pendingTransfersCount,
      },
      myAssets,
      upcomingReturns,
      upcomingBookings,
      maintenanceStatus,
      recentActivities: sortedActivities,
    };

    return successResponse(res, 200, 'Employee dashboard data retrieved successfully', dashboardData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployeeDashboard,
};
