# AssetFlow (Odoo Hackathon 2K26)

AssetFlow is an enterprise-grade Asset Management System built for the Odoo Hackathon 2K26. It provides a comprehensive suite of tools for organizations to track, manage, allocate, and audit their assets efficiently.

## 🚀 Features

- **Asset Registration & Directory**: Maintain a centralized repository of all organizational assets with detailed specifications.
- **Allocation & Transfer**: Seamlessly assign assets to employees and track internal transfers across departments.
- **Resource Booking**: An interactive calendar interface for booking shared resources and equipment.
- **Maintenance Management**: Schedule, track, and log maintenance activities to minimize asset downtime.
- **Asset Audit & Compliance**: Conduct rigorous asset audits and generate compliance reports.
- **Role-Based Access Control (RBAC)**: Secure access tailored for `ADMIN`, `SUPERADMIN`, `ASSET_MANAGER`, `DEPARTMENT_HEAD`, and `EMPLOYEE` roles.
- **Real-Time Notifications**: Stay updated with activity logs and system alerts.

## 🛠 Tech Stack

### Frontend (Client)
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **Forms & Validation**: React Hook Form + Zod
- **Icons & Charts**: Lucide React, Recharts

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySql
- **ORM**: Prisma
- **Security**: Helmet, bcryptjs, jsonwebtoken (JWT)

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions (Automated Frontend/Backend/Docker checks)

---

## 🚦 Getting Started

### Prerequisites
Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [Docker](https://www.docker.com/) and Docker Compose
- Git

### 1. Quick Start (Using Docker Compose)
The easiest way to run the entire stack (Database, Backend, and Frontend) is using Docker Compose.

```bash
# Clone the repository
git clone https://github.com/A-Deepak1610/Odoo-Hackathon.git
cd Odoo-Hackathon

# Copy the environment variables
cp server/.env.example server/.env

# Build and spin up the containers
docker compose up --build
```
- Frontend will be available at `http://localhost:5173`
- Backend API will be available at `http://localhost:5000`
- PostgreSQL Database will be mapped to port `5432`

---

### 2. Manual Local Setup
If you prefer running the services locally for development:

#### Database Setup
Ensure you have a local instance of PostgreSQL running. Create a database for the project and keep your credentials handy.

#### Backend Setup
```bash
cd server

# Copy environment variables and update DATABASE_URL
cp .env.example .env

# Install dependencies
npm install

# Generate Prisma Client and run migrations
npx prisma generate
npx prisma migrate dev

# Start the development server
npm run dev
```

#### Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

---

## 📁 Project Structure

```text
Odoo-Hackathon/
├── .github/workflows/   # CI/CD pipelines
├── client/              # React frontend application
│   ├── src/             
│   │   ├── app/         # Global layouts and contexts
│   │   ├── modules/     # Feature-based modular architecture (Auth, Asset Manager, etc.)
│   │   └── services/    # API clients and utilities
├── server/              # Node.js backend API
│   ├── prisma/          # Database schema and migrations
│   └── src/
│       ├── modules/     # API controllers, routes, and services
│       └── middlewares/ # Authentication and error handling
└── docker-compose.yml   # Multi-container orchestration
```

## 🤝 Contributing

1. Check out the `CONTRIBUTING.md`, `IMPORT_RULES.md`, and `MODULE_GUIDE.md` files for our development guidelines.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request!
