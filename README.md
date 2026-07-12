<div align="center">
  <h1>🚀 AssetFlow (Odoo Hackathon 2K26)</h1>
  <p><strong>An Enterprise-Grade Asset Management & Booking System</strong></p>
</div>

---

## 📖 Overview

**AssetFlow** is a comprehensive, modular asset management system designed to streamline internal resource allocation, maintenance, and booking. Built using modern web architecture, it provides an intuitive interface for employees while ensuring strict role-based access control (RBAC) and compliance auditing for administrators.

## 🏗️ System Architecture

AssetFlow follows a decoupled client-server architecture, containerized with Docker for predictable deployments and environment consistency.

```mermaid
graph TD
    %% User Interfaces
    User([User / Browser])
    
    %% Frontend Layer
    subgraph Frontend [Client - React 19 / Vite]
        UI[Asset Manager UI Shell]
        Routing[React Router DOM]
        State[Context API / Hooks]
    end

    %% Backend Layer
    subgraph Backend [Server - Node.js / Express]
        API[Dynamic Express Router]
        Middleware[Auth / Error Handling / Logger]
        Modules[Domain Modules: Assets, Booking, Maintenance...]
        Prisma[Prisma ORM Client]
    end

    %% Database Layer
    subgraph Database [Storage]
        MySQL[(MySQL 8)]
    end

    %% Connections
    User -->|HTTP / REST| Frontend
    Frontend -->|Axios JSON Requests| API
    API --> Middleware
    Middleware --> Modules
    Modules --> Prisma
    Prisma -->|SQL / TCP| MySQL
```

### Core Technologies
*   **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Recharts, React Hook Form, Zod.
*   **Backend**: Node.js, Express.js, Prisma ORM, Winston Logger, Jest + Supertest (Testing).
*   **Database**: MySQL 8.
*   **Infrastructure**: Docker, Docker Compose, GitHub Actions (CI/CD).

---

## ✨ Key Features

- **Centralized Asset Directory**: Register, categorize, and track lifecycle events of organizational hardware and software assets.
- **Resource Booking Calendar**: An interactive scheduling interface (`react-big-calendar`) to reserve shared resources without conflicts.
- **Allocation & Transfers**: Assign assets directly to employees and maintain a rigorous audit trail of inter-departmental transfers.
- **Maintenance Management**: Log issues, schedule repairs, and track the cost/downtime of maintenance events.
- **Granular RBAC**: Highly secured routes and data access specific to `SUPERADMIN`, `ADMIN`, `ASSET_MANAGER`, `DEPARTMENT_HEAD`, and `EMPLOYEE`.
- **System Health & Logs**: Integrated Winston logging for system metrics and activity auditing.

---

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
