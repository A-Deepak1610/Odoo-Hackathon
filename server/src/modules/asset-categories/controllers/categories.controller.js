const { prisma } = require('../../../core/database/prisma');
const { successResponse } = require('../../../core/response/apiResponse');

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.assetCategory.findMany({
      select: {
        id: true,
        name: true,
        description: true
      }
    });

    return successResponse(res, 200, 'Categories retrieved successfully', categories);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories };
