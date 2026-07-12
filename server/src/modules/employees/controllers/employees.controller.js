const { prisma } = require('../../../core/database/prisma');
const { successResponse } = require('../../../core/response/apiResponse');
const { ApiError } = require('../../../core/errors/ApiError');
const bcrypt = require('bcryptjs');

const getEmployees = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const employees = await prisma.user.findMany({
      where: { organizationId: orgId, isActive: true },
      include: { department: true }
    });
    return successResponse(res, 200, 'Employees retrieved', employees);
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const { name, email, role, departmentId } = req.body;

    if (!name || !email || !role) {
      throw new ApiError(400, 'Name, email, and role are required');
    }

    // Default password securely hashed
    const passwordHash = await bcrypt.hash('Password123!', 10);

    const employee = await prisma.user.create({
      data: {
        organizationId: orgId,
        name,
        email,
        role: role.toUpperCase(),
        departmentId: departmentId || null,
        passwordHash,
        isActive: true
      },
      include: { department: true }
    });

    return successResponse(res, 201, 'Employee created successfully', employee);
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, role, departmentId, isActive } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (role !== undefined) data.role = role.toUpperCase();
    if (departmentId !== undefined) data.departmentId = departmentId || null;
    if (isActive !== undefined) data.isActive = !!isActive;

    const employee = await prisma.user.update({
      where: { id },
      data,
      include: { department: true }
    });

    return successResponse(res, 200, 'Employee updated successfully', employee);
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Soft delete
    const employee = await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });

    return successResponse(res, 200, 'Employee removed successfully', employee);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
