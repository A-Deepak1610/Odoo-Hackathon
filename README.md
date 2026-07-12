<div align="center">
  <h1>🚀 AssetFlow (Odoo Hackathon 2K26)</h1>
  <p><strong>An Enterprise-Grade Asset Management & Booking System</strong></p>
</div>

---

## 📖 Overall Vision

The vision for **AssetFlow** is to simplify and digitize how organizations track, allocate, and maintain their physical assets and shared resources through a centralized ERP platform. This is not tied to any single industry; any organization with equipment, furniture, vehicles, or shared spaces (offices, schools, hospitals, factories, agencies) can use it.

The platform aims to reduce manual tracking inefficiencies (spreadsheets, paper logs) by enabling structured asset lifecycles, centralized resource booking, and real-time visibility into who holds what, where it is, and its condition.

AssetFlow focuses on delivering core ERP functionality with clean architecture, role-based workflows, and scalable module design without touching purchasing, invoicing, or accounting concerns.

## 🎯 Mission & Problem Statement

**The Mission:** To build a user-centric, responsive application that simplifies asset and resource management. The platform provides staff with intuitive tools to:
- Set up departments, asset categories, and the employee directory
- Register and track assets through their full lifecycle
- Allocate assets to employees/departments with conflict handling
- Book shared resources (rooms, vehicles, equipment) without overlaps
- Run a structured maintenance approval workflow
- Run structured audit cycles to catch discrepancies
- Get notified of overdue returns, bookings, and maintenance events

**The Problem Statement:** Organizations need an Enterprise Asset & Resource Management System to track assets through a flexible lifecycle (Available ↔ Under Maintenance, Allocated → Available), prevent double-allocation, book shared resources without overlap, route maintenance requests through approval workflows, and run scheduled audit cycles. The application must demonstrate proper ERP architecture, reusable modules, secure role-based workflows (with realistic account creation), and an intuitive UI/UX.

## ✨ Core Features

**1. Login / Signup Screen**
- Authenticate users with realistic, non-self-elevating account creation (Signup creates an Employee account only).
- Admin creates/promotes Department Heads and Asset Managers from the Employee Directory.

**2. Dashboard / Home Screen**
- Give every role a real-time operational snapshot.
- KPI cards: Assets Available, Assets Allocated, Maintenance Today, Active Bookings, Pending Transfers, Upcoming Returns.
- Overdue returns are highlighted separately; Quick actions included.

**3. Organization Setup Screen (Admin Only)**
- **Department Management:** Create/edit/deactivate, assign Head & Parent Department.
- **Asset Category Management:** Create/edit categories with specific fields.
- **Employee Directory:** Manage employees and promote them to Department Head or Asset Manager.

**4. Asset Registration & Directory Screen**
- Register: Name, Category, auto-generated Asset Tag, Serial Number, condition, location, and shared flag.
- Search/filter by Asset Tag, QR code, category, status. Lifecycle tracking and per-asset history.

**5. Asset Allocation & Transfer Screen**
- Allocate asset with optional Expected Return Date (blocks double-allocation automatically).
- Transfer workflow: Requested → Approved → Re-allocated. Overdue allocations are auto-flagged.

**6. Resource Booking Screen**
- Time-slot booking of shared resources with strict no-overlap validation.
- Calendar view, booking status management, and reminder notifications.

**7. Maintenance Management Screen**
- Raise requests with priority and photos; route through approval workflow before work starts.
- Asset status auto-updates to Under Maintenance on approval.

**8. Asset Audit Screen**
- Create an Audit Cycle, assign auditors, and mark assets (Verified/Missing/Damaged).
- System auto-generates discrepancy reports and updates statuses on close.

**9. Reports & Analytics Screen**
- Asset utilization trends, maintenance frequency, and department-wise allocation summary.
- Resource booking heatmap and exportable reports.

**10. Activity Logs & Notifications Screen**
- Full audit log of all actions. Notifications for asset assignments, approvals, overdue returns, and flags.

## 👥 User Roles

- **Admin:** Manages departments, asset categories, audit cycles, and employee/role assignment. Views org-wide analytics.
- **Asset Manager:** Registers/allocates assets, approves transfers/maintenance/audit discrepancies.
- **Department Head:** Views department assets, approves internal transfers, books resources.
- **Employee:** Views own assets, books resources, raises maintenance requests, initiates transfers.

## 🔄 Basic Workflow

1. Admin sets up departments, categories, and promotes employees to Department Head / Asset Manager.
2. Asset Manager registers a new asset (status: Available).
3. Asset is allocated (blocked if already allocated) or marked as a shared bookable resource.
4. Employees book shared resources by time slot (overlaps rejected).
5. Holders raise maintenance requests (must be approved before repair starts).
6. Assets are transferred/returned; overdue returns are flagged.
7. Periodic audit cycles verify assets and generate discrepancy reports.
8. All activity is tracked through notifications, logs, and reports.

---

## 🏗️ System Architecture

## 📁 Repository Structure

The project follows a highly scalable, domain-driven structure:

```text
Odoo-Hackathon/
├── .github/workflows/       # Automated CI Pipelines (Linting, Testing, Docker Build)
├── client/                  # React Frontend Application
│   ├── public/              
│   ├── src/                 
│   │   ├── app/layouts/     # Global layout components (Sidebar, Navbar, AppLayout)
│   │   ├── modules/         # Domain logic (auth, asset-manager, organization, etc.)
│   │   └── services/        # API integration (Axios client setup)
│   ├── Dockerfile           # Frontend container definition
│   └── package.json         
├── server/                  # Node.js Backend Application
│   ├── prisma/              # Schema definitions and database migrations
│   ├── src/                 
│   │   ├── core/            # Global middlewares (Logger, Errors, Response Formatting)
│   │   └── modules/         # Domain logic (controllers, routes, services per feature)
│   ├── __tests__/           # Jest & Supertest API testing suites
│   ├── Dockerfile           # Backend container definition
│   └── package.json         
├── docker-compose.yml       # Orchestrates Client, Server, and MySQL networks
├── SETUP.md                 # Additional setup edge-cases
├── MODULE_GUIDE.md          # Guide on how to create a new module
└── IMPORT_RULES.md          # Architecture dependency rules
```

---

## 🚀 Installation & Setup

We recommend using Docker for the quickest start, but manual installation is fully supported for active development.

### Prerequisites
- [Node.js (v20+)](https://nodejs.org/)
- [Docker & Docker Compose](https://www.docker.com/) (For containerized setup)

### Method 1: Docker Compose (Recommended)

This command spins up the MySQL Database, Node Backend, and React Frontend in an isolated network.

1. **Clone the repository**
   ```bash
   git clone https://github.com/A-Deepak1610/Odoo-Hackathon.git
   cd Odoo-Hackathon
   ```
2. **Setup Environment Variables**
   ```bash
   # Copy the backend example env file
   cp server/.env.example server/.env
   ```
3. **Build and Run**
   ```bash
   docker compose up --build
   ```
   * **Frontend**: `http://localhost:5173`
   * **Backend**: `http://localhost:5000`
   * **Database**: Port `3306`

---

### Method 2: Manual Local Development

Use this method if you need to actively develop and leverage features like hot-reloading.

#### 1. Database Setup
Start a local MySQL instance and note your connection string.

#### 2. Backend Installation
```bash
cd server
cp .env.example .env

# Update DATABASE_URL in .env to match your local MySQL credentials
# e.g., DATABASE_URL="mysql://root:password@localhost:3306/assetflow"

npm install

# Generate the Prisma client & run migrations
npx prisma generate
npx prisma migrate dev

# Run the development server
npm run dev
```

#### 3. Frontend Installation
In a new terminal window:
```bash
cd client
npm install

# Start the Vite development server
npm run dev
```

---

## 🧪 Testing

The backend is configured with **Jest** and **Supertest** to validate endpoints directly against the Express app instance.

To run the test suite:
```bash
cd server
npm test
```
*Current coverage includes global routing boundaries and the `health` module check.*

---

## 🤝 Contributing

We welcome contributions! Please review our [CONTRIBUTING.md](./CONTRIBUTING.md) guide before pushing code. Note that all PRs must pass the automated GitHub Actions CI checks (Linting, Tests, and Docker Build Verification) before they can be merged into `main`.

**License**: ISC
