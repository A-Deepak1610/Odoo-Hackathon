const { prisma } = require('../../../core/database/prisma');
const { successResponse } = require('../../../core/response/apiResponse');
<<<<<<< HEAD
const { ApiError } = require('../../../core/errors/ApiError');
const bcrypt = require('bcryptjs');

/**
 * Get all employees in the organization
 */
const getEmployees = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const whereClause = orgId ? { organizationId: orgId } : {};

    const employees = await prisma.user.findMany({
      where: whereClause,
      include: {
        department: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return successResponse(res, 200, 'Employees retrieved successfully', employees);
=======

const getEmployees = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const employees = await prisma.user.findMany({
      where: { organizationId: orgId, isActive: true },
      include: { department: true }
    });
    return successResponse(res, 200, 'Employees retrieved', employees);
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
  } catch (error) {
    next(error);
  }
};

<<<<<<< HEAD
/**
 * Add / Invite a new employee
 */
const createEmployee = async (req, res, next) => {
  try {
    let orgId = req.user.organizationId;
    if (!orgId) {
      const firstOrg = await prisma.organization.findFirst();
      orgId = firstOrg?.id;
    }

    const { name, email, departmentId, role } = req.body;

    if (!name || !email) {
      throw new ApiError(400, 'Name and email are required');
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      throw new ApiError(400, `User with email ${email} already exists`);
    }

    // Generate default hashed password: 'Password123!'
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('Password123!', salt);

    const employee = await prisma.user.create({
      data: {
        organizationId: orgId,
        name,
        email,
        passwordHash: hash,
        departmentId: departmentId || null,
        role: role || 'EMPLOYEE',
        isActive: true
      },
      include: {
        department: true
      }
    });

    return successResponse(res, 201, 'Employee created successfully', employee);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an employee record
 */
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, departmentId, role, isActive } = req.body;

    const existing = await prisma.user.findUnique({
      where: { id }
    });

    if (!existing) {
      throw new ApiError(404, 'Employee not found');
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        email: email !== undefined ? email : existing.email,
        departmentId: departmentId !== undefined ? departmentId : existing.departmentId,
        role: role !== undefined ? role : existing.role,
        isActive: isActive !== undefined ? isActive : existing.isActive
      },
      include: {
        department: true
      }
    });

    return successResponse(res, 200, 'Employee updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an employee
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.user.findUnique({
      where: { id }
    });

    if (!existing) {
      throw new ApiError(404, 'Employee not found');
    }

    await prisma.user.delete({
      where: { id }
    });

    return successResponse(res, 200, 'Employee deleted successfully');
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
=======
module.exports = { getEmployees };
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
