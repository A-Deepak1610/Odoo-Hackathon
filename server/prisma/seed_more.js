const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting additional data seeding for ASSET_MANAGER...');

  const org = await prisma.organization.findFirst({ where: { name: 'Acme Corp' } });
  if (!org) {
    console.log('Org not found. Please run initial seed first.');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  // Departments
  const deptsData = ['Marketing', 'Human Resources', 'IT Support'];
  const depts = [];
  for (const name of deptsData) {
    let d = await prisma.department.findFirst({ where: { name, organizationId: org.id } });
    if (!d) {
      d = await prisma.department.create({ data: { name, organizationId: org.id, isActive: true } });
    }
    depts.push(d);
  }

  // Users
  const usersData = [
    { email: 'sarah.j@acme.com', name: 'Sarah Jenkins', role: 'EMPLOYEE', dept: depts[0].id },
    { email: 'mike.r@acme.com', name: 'Mike Ross', role: 'EMPLOYEE', dept: depts[0].id },
    { email: 'alex.c@acme.com', name: 'Alex Chen', role: 'EMPLOYEE', dept: depts[2].id },
    { email: 'john.d@acme.com', name: 'John Doe', role: 'EMPLOYEE', dept: depts[1].id },
    { email: 'asset.manager@acme.com', name: 'Manager Bob', role: 'ASSET_MANAGER', dept: depts[2].id },
  ];
  const users = [];
  for (const u of usersData) {
    let dbUser = await prisma.user.findUnique({ where: { email: u.email } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: u.email, name: u.name, role: u.role, passwordHash,
          organizationId: org.id, departmentId: u.dept, isActive: true
        }
      });
    }
    users.push(dbUser);
  }

  // Categories
  const catsData = ['Monitors', 'Furniture', 'AV Equipment'];
  const categories = [];
  for (const name of catsData) {
    let c = await prisma.assetCategory.findFirst({ where: { name, organizationId: org.id } });
    if (!c) {
      c = await prisma.assetCategory.create({ data: { name, organizationId: org.id } });
    }
    categories.push(c);
  }

  // Assets
  const assetsData = [
    { name: 'Dell UltraSharp 32"', tag: 'AST-MON-001', cat: categories[0].id, bookable: false, status: 'ALLOCATED', user: users[3].id },
    { name: 'Dell UltraSharp 32"', tag: 'AST-MON-002', cat: categories[0].id, bookable: false, status: 'AVAILABLE', user: null },
    { name: 'Herman Miller Chair', tag: 'AST-FUR-001', cat: categories[1].id, bookable: false, status: 'ALLOCATED', user: users[0].id },
    { name: 'Conference Projector B', tag: 'AST-AV-002', cat: categories[2].id, bookable: true, status: 'AVAILABLE', user: null },
    { name: 'Sony A7IV Camera Kit', tag: 'AST-AV-003', cat: categories[2].id, bookable: true, status: 'AVAILABLE', user: null },
  ];
  const assets = [];
  for (const a of assetsData) {
    let dbAsset = await prisma.asset.findFirst({ where: { assetTag: a.tag, organizationId: org.id } });
    if (!dbAsset) {
      dbAsset = await prisma.asset.create({
        data: {
          name: a.name, assetTag: a.tag, categoryId: a.cat, organizationId: org.id,
          isSharedBookable: a.bookable, status: a.status, currentEmployeeId: a.user
        }
      });
    }
    assets.push(dbAsset);
  }

  // Allocations
  for (const a of assetsData) {
    if (a.status === 'ALLOCATED') {
      const ast = assets.find(as => as.assetTag === a.tag);
      const existing = await prisma.allocation.findFirst({ where: { assetId: ast.id, status: 'ACTIVE' } });
      if (!existing) {
        await prisma.allocation.create({
          data: {
            organizationId: org.id, assetId: ast.id, toEmployeeId: a.user, requestedById: users[4].id,
            status: 'ACTIVE'
          }
        });
      }
    }
  }

  // Pending Transfers
  const p1 = await prisma.allocation.findFirst({ where: { status: 'PENDING', assetId: assets[1].id } });
  if (!p1) {
    await prisma.allocation.create({
      data: {
        organizationId: org.id, assetId: assets[1].id, toEmployeeId: users[1].id, requestedById: users[1].id,
        status: 'PENDING'
      }
    });
  }

  // Maintenance Requests
  const m1 = await prisma.maintenanceRequest.findFirst({ where: { assetId: assets[0].id } });
  if (!m1) {
    await prisma.maintenanceRequest.create({
      data: {
        organizationId: org.id, assetId: assets[0].id, requestedById: users[3].id,
        description: 'Screen is flickering heavily', priority: 'HIGH', status: 'IN_PROGRESS',
        approvedById: users[4].id
      }
    });
    await prisma.asset.update({ where: { id: assets[0].id }, data: { status: 'UNDER_MAINTENANCE' }});
  }

  const m2 = await prisma.maintenanceRequest.findFirst({ where: { assetId: assets[2].id } });
  if (!m2) {
    await prisma.maintenanceRequest.create({
      data: {
        organizationId: org.id, assetId: assets[2].id, requestedById: users[0].id,
        description: 'Armrest is broken', priority: 'MEDIUM', status: 'PENDING'
      }
    });
  }

  const m3 = await prisma.maintenanceRequest.findFirst({ where: { assetId: assets[3].id } });
  if (!m3) {
    await prisma.maintenanceRequest.create({
      data: {
        organizationId: org.id, assetId: assets[3].id, requestedById: users[1].id,
        description: 'Bulb seems dead', priority: 'HIGH', status: 'APPROVED', approvedById: users[4].id
      }
    });
  }

  // Bookings
  const today = new Date();
  today.setHours(10, 0, 0, 0);
  
  const b1 = await prisma.resourceBooking.findFirst({ where: { assetId: assets[3].id, bookedByEmployeeId: users[0].id } });
  if (!b1) {
    const end = new Date(today);
    end.setHours(12, 0, 0, 0);
    await prisma.resourceBooking.create({
      data: {
        organizationId: org.id, assetId: assets[3].id, bookedByEmployeeId: users[0].id,
        startTime: today, endTime: end, status: 'UPCOMING'
      }
    });
  }

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endTomorrow = new Date(tomorrow);
  endTomorrow.setHours(14, 0, 0, 0);
  const b2 = await prisma.resourceBooking.findFirst({ where: { assetId: assets[4].id, bookedByEmployeeId: users[2].id } });
  if (!b2) {
    await prisma.resourceBooking.create({
      data: {
        organizationId: org.id, assetId: assets[4].id, bookedByEmployeeId: users[2].id,
        startTime: tomorrow, endTime: endTomorrow, status: 'UPCOMING'
      }
    });
  }

  console.log('✅ More data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
