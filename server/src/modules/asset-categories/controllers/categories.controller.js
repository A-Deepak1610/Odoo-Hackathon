const { prisma } = require('../../../core/database/prisma');
const { successResponse } = require('../../../core/response/apiResponse');
const { ApiError } = require('../../../core/errors/ApiError');

const getCategories = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const categories = await prisma.assetCategory.findMany({
      where: { organizationId: orgId }
    });
    return successResponse(res, 200, 'Categories retrieved successfully', categories);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const { name, description } = req.body;

    if (!name) {
      throw new ApiError(400, 'Name is required');
    }

    const category = await prisma.assetCategory.create({
      data: {
        organizationId: orgId,
        name,
        description
      }
    });

    return successResponse(res, 201, 'Category created successfully', category);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory
};
