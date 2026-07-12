# AssetFlow Architecture Guide

## 1. Overview
AssetFlow follows a **Modular Monolith** architecture based on Domain-Driven Design (DDD) principles and Clean Architecture. This approach enables us to build a robust, scalable Enterprise Resource Planning (ERP) system while keeping cognitive load manageable and preparing for a future microservices migration without changing business logic.

## 2. Backend Folder Structure (`server/`)
```
server/
├── prisma/               # Centralized Prisma schema, seeds, and migrations
├── src/
│   ├── app.js            # Express application setup
│   ├── server.js         # Entry point (HTTP server)
│   ├── core/             # Application-level configurations and infrastructure
│   ├── shared/           # Cross-cutting domain concepts (Shared Kernel)
│   └── modules/          # Domain boundaries (Bounded Contexts)
```

### Explanation of Top-Level Folders
*   **`core/`**: Houses global concerns completely independent of business logic. Includes database connections, error handling middleware, logging, global constants, application utilities, and security configurations.
*   **`shared/`**: The "Shared Kernel." Contains types, interfaces, enums, and helpers that are truly universal across the entire application domain.
*   **`modules/`**: The heart of the modular monolith. Each module (e.g., `assets`, `booking`, `maintenance`) acts as a completely independent, miniature application (a Bounded Context).
*   **`prisma/`**: We centralize Prisma because it outputs a single client object (`@prisma/client`) representing the database. Modules' repositories will import from this central client, but each repository is restricted to querying only tables belonging to its domain.

## 3. Frontend Folder Structure (`client/src/`)
```
client/
└── src/
    ├── app/              # Bootstrapping (Router, Layouts, Providers, Theme)
    ├── shared/           # Reusable UI components, hooks, utils, and global state
    └── modules/          # Feature-first domain modules (mirrors backend)
```

### Explanation of Frontend Structure
*   **`app/`**: Handles application wiring. Contains layout wrappers, React Router setup, and Context/Providers (e.g., TanStack Query Provider, Theme Provider).
*   **`shared/`**: Houses the foundational UI kit (`Button`, `Table`, `Modal`), global stores (Zustand), generic hooks, and assets.
*   **`modules/`**: Mirrors the backend modules. Each module owns its specific pages, feature components, API hooks, Zod schemas, and local state.

## 4. Module Internal Architecture
Inside every backend module, you will find:
*   **`routes/`**: Defines HTTP endpoints and mounts middlewares (Auth, Zod validation).
*   **`controllers/`**: Extracts parameters from the request, calls the Service, and formats the HTTP response. **No business logic.**
*   **`services/`**: The orchestrator. Contains pure business rules and logic. **Never imports Express/HTTP objects.**
*   **`repositories/`**: Abstracts database operations. Uses Prisma to interact with PostgreSQL. **No business rules.**
*   **`validators/`**: Zod schemas for request validation.
*   **`dto/`**: Data Transfer Objects for typing inputs/outputs.
*   **`policies/` & `permissions/`**: Domain-specific authorization rules.
*   **`events/`**: Publishers/subscribers for domain events.
*   **`constants/`, `utils/`, `mappers/`, `schemas/`**: Domain-specific helpers.

## 5. Dependency Rules (The Golden Rule)
To maintain Clean Architecture, the flow of control must strictly move inwards:
**Route ➔ Controller ➔ Service ➔ Repository ➔ Prisma ➔ PostgreSQL**

*   A Controller can call a Service, but a Service cannot call a Controller.
*   A Service can call a Repository, but a Repository cannot call a Service.

## 6. Module Boundaries & Communication
Modules are isolated. **Never import another module's internal files.**
*   **Correct:** `import { AssetService } from '../../modules/assets';` (using the public `index.js` export)
*   **Wrong:** `import { AssetService } from '../../modules/assets/services/asset.service.js';`

Services in one module may communicate with another module *only* through its public interface (`index.js`) or via domain events.

## 7. Migration to Microservices
This architecture is deliberately designed so that extracting a module (e.g., `assets`) into a standalone microservice requires minimal effort:
1.  **Extract the Module:** Copy `server/src/modules/assets` to a new repository. The internal files (`controllers`, `services`, `repositories`) require **zero** logic changes.
2.  **Extract the Data:** Move the asset-related models from the central `schema.prisma` to the new repository's Prisma schema and migrate the data.
3.  **Swap the Interface:** Instead of another module (e.g., `booking`) directly importing the `AssetService` locally, the `booking` module's HTTP or gRPC client will now call the new Asset Service over the network. The business logic remains untouched.

## 8. Why This Architecture for an ERP?
Enterprise Resource Planning systems contain many interconnected modules (HR, Inventory, Bookings, Finance). 
*   **A traditional Monolith** quickly becomes a "Big Ball of Mud" where modules are tightly coupled, making it impossible to update one feature without breaking another.
*   **Microservices** from Day 1 introduce massive operational overhead (distributed tracing, network latency, deployment complexity) that slows down development.
*   **The Modular Monolith** provides the best of both worlds. We get the fast development speed and simple deployment of a monolith, while enforcing the strict boundaries necessary to scale team size and eventually distribute the system when performance demands it.
