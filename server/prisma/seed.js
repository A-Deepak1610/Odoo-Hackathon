const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Organization
  const orgName = 'Acme Corp';
  let org = await prisma.organization.findFirst({
    where: { name: orgName },
  });

  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: orgName,
        subdomain: 'acme',
        subscriptionPlan: 'ENTERPRISE',
        isActive: true,
      },
    });
    console.log(`✅ Seeded Organization: ${org.name}`);
  }

  // 2. Seed Department
  const deptName = 'Engineering';
  let dept = await prisma.department.findFirst({
    where: { organizationId: org.id, name: deptName },
  });

  if (!dept) {
    dept = await prisma.department.create({
      data: {
        name: deptName,
        organizationId: org.id,
        isActive: true,
      },
    });
    console.log(`✅ Seeded Department: ${dept.name}`);
  }

  // 3. Seed Admin User
  const adminEmail = 'admin@assertflow.com';
  let admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  const salt = await bcrypt.genSalt(10);

  if (!admin) {
    const adminPasswordHash = await bcrypt.hash('Admin123!', salt);
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: adminPasswordHash,
        name: 'Admin User',
        role: 'ADMIN',
        organizationId: org.id,
        departmentId: dept.id,
        isActive: true,
      },
    });
    console.log(`✅ Seeded Admin User: ${admin.email}`);
  }

  // 4. Seed Employee User
  const employeeEmail = 'employee@assertflow.com';
  let employee = await prisma.user.findUnique({
    where: { email: employeeEmail },
  });

  if (!employee) {
    const employeePasswordHash = await bcrypt.hash('Password123!', salt);
    employee = await prisma.user.create({
      data: {
        email: employeeEmail,
        passwordHash: employeePasswordHash,
        name: 'John Doe',
        role: 'EMPLOYEE',
        organizationId: org.id,
        departmentId: dept.id,
        isActive: true,
      },
    });
    console.log(`✅ Seeded Employee User: ${employee.email}`);
  }

  // Link department head to admin
  await prisma.department.update({
    where: { id: dept.id },
    data: { headId: admin.id },
  });

  // 5. Seed Asset Categories
  let catLaptops = await prisma.assetCategory.findFirst({
    where: { organizationId: org.id, name: 'Laptops' },
  });

  if (!catLaptops) {
    catLaptops = await prisma.assetCategory.create({
      data: {
        name: 'Laptops',
        description: 'Employee workstations and portable gear',
        organizationId: org.id,
      },
    });
    console.log(`✅ Seeded Asset Category: ${catLaptops.name}`);
  }

  let catFacilities = await prisma.assetCategory.findFirst({
    where: { organizationId: org.id, name: 'Facilities' },
  });

  if (!catFacilities) {
    catFacilities = await prisma.assetCategory.create({
      data: {
        name: 'Facilities',
        description: 'Meeting rooms and workspace spaces',
        organizationId: org.id,
      },
    });
    console.log(`✅ Seeded Asset Category: ${catFacilities.name}`);
  }

  // 6. Seed Assets
  let laptopAsset = await prisma.asset.findFirst({
    where: { organizationId: org.id, assetTag: 'AST-LPT-001' },
  });

  if (!laptopAsset) {
    laptopAsset = await prisma.asset.create({
      data: {
        name: 'ThinkPad X1 Carbon Gen 11',
        assetTag: 'AST-LPT-001',
        serialNumber: 'LPT12345678',
        categoryId: catLaptops.id,
        condition: 'Excellent',
        location: 'Acme HQ - 4th Floor',
        status: 'ALLOCATED',
        currentEmployeeId: employee.id, // assigned to employee
        currentDepartmentId: dept.id,
        organizationId: org.id,
      },
    });
    console.log(`✅ Seeded Asset (Laptop): ${laptopAsset.name}`);
  }

  let roomAsset = await prisma.asset.findFirst({
    where: { organizationId: org.id, assetTag: 'AST-FAC-001' },
  });

  if (!roomAsset) {
    roomAsset = await prisma.asset.create({
      data: {
        name: 'Conference Room A (Glass)',
        assetTag: 'AST-FAC-001',
        categoryId: catFacilities.id,
        condition: 'Good',
        location: 'Acme HQ - 1st Floor',
        status: 'AVAILABLE',
        isSharedBookable: true, // bookable
        organizationId: org.id,
      },
    });
    console.log(`✅ Seeded Asset (Conference Room): ${roomAsset.name}`);
  }

  // 7. Seed Allocation (Assigned Material Record)
  const existingAlloc = await prisma.allocation.findFirst({
    where: { assetId: laptopAsset.id, toEmployeeId: employee.id },
  });

  if (!existingAlloc) {
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 14); // Due in 14 days

    await prisma.allocation.create({
      data: {
        organizationId: org.id,
        assetId: laptopAsset.id,
        toEmployeeId: employee.id,
        toDepartmentId: dept.id,
        requestedById: admin.id,
        approvedById: admin.id,
        status: 'ACTIVE',
        expectedReturnDate: returnDate,
      },
    });
    console.log(`✅ Seeded Active Allocation for: ${employee.name}`);
  }

  // 8. Seed Upcoming Booking (Meeting Room booking)
  const existingBooking = await prisma.resourceBooking.findFirst({
    where: { assetId: roomAsset.id, bookedByEmployeeId: employee.id },
  });

  if (!existingBooking) {
    const startTime = new Date();
    startTime.setDate(startTime.getDate() + 1); // Tomorrow
    startTime.setHours(10, 0, 0, 0); // 10:00 AM

    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 1); // Tomorrow
    endTime.setHours(12, 0, 0, 0); // 12:00 PM

    await prisma.resourceBooking.create({
      data: {
        organizationId: org.id,
        assetId: roomAsset.id,
        bookedByEmployeeId: employee.id,
        startTime,
        endTime,
        status: 'UPCOMING',
      },
    });
    console.log(`✅ Seeded Resource Booking for: ${employee.name}`);
  }

  // 9. Seed Maintenance Request
  const existingMaint = await prisma.maintenanceRequest.findFirst({
    where: { assetId: laptopAsset.id, requestedById: employee.id },
  });

  if (!existingMaint) {
    await prisma.maintenanceRequest.create({
      data: {
        organizationId: org.id,
        assetId: laptopAsset.id,
        requestedById: employee.id,
        description: 'Keyboard key "E" is stuck and requires replacement.',
        priority: 'MEDIUM',
        status: 'PENDING',
      },
    });
    console.log(`✅ Seeded Maintenance Request raised by: ${employee.name}`);
  }

  console.log('🌱 Seeding process complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
