const { prisma } = require('../../../core/database/prisma');
const { successResponse } = require('../../../core/response/apiResponse');
<<<<<<< HEAD

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.assetCategory.findMany({
      select: {
        id: true,
        name: true,
        description: true
      }
    });

=======
const { ApiError } = require('../../../core/errors/ApiError');

const getCategories = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const categories = await prisma.assetCategory.findMany({
      where: { organizationId: orgId }
    });
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
    return successResponse(res, 200, 'Categories retrieved successfully', categories);
  } catch (error) {
    next(error);
  }
};

<<<<<<< HEAD
module.exports = { getCategories };
=======
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
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
