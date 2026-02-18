# Vistora

Vistora is a backend-heavy full stack digital catalogue and assisted wholesale selling platform for high-footfall textile, saree, fabric, and garment stores. Customers browse products digitally, shortlist interesting items, and request staff to physically show selected pieces. Store owners retain control over sensitive business information through role-aware visibility rules and a secure admin/staff dashboard.

## Why This Project Is Strong

Vistora is intentionally designed as a serious systems project rather than a flat CRUD app:

- Multi-tenant ready store-aware schema from day one
- Layered backend architecture with controllers, services, repositories, policies, and DTO validation
- Role-based visibility enforcement for sensitive commercial fields
- Session-based customer flows for walk-in store traffic
- Snapshotting of showroom request items to preserve historical consistency
- Production-friendly conventions: OpenAPI, rate limiting, structured logging, soft deletes, audit logging, Docker support, and test scaffolding

## Monorepo Structure

```text
.
├── apps
│   ├── api          # Express + Prisma + TypeScript backend
│   └── web          # Next.js + Tailwind TypeScript frontend
├── packages
│   └── shared       # Shared enums, DTO types, and cross-app contracts
├── README.md
├── idea.md
├── useCaseDiagram.md
├── sequenceDiagram.md
├── classDiagram.md
└── ErDiagram.md
```

## Architecture Overview

### Backend

The API is organized into feature modules under `apps/api/src/modules`. Each module owns its route definitions, controller, service, repository, validation schema, and data contracts. Controllers stay thin; business rules live in services; Prisma access is encapsulated in repositories.

Key backend layers:

- `routes` for HTTP assembly and versioned route mounting
- `controllers` for translating HTTP requests into service calls
- `services` for domain logic, transactions, and orchestration
- `repositories` for Prisma access and store-aware queries
- `middlewares` for auth, RBAC, validation, error handling, and request context
- `policies` for response shaping and visibility rule enforcement
- `common` for reusable infra such as `AppError`, `BaseResponseBuilder`, and `JwtService`

### Frontend

The web app uses the Next.js App Router. The customer-facing catalogue emphasizes discovery and shortlist flows. The admin side provides dashboard shells for product, category, request, user, and store management. The frontend currently uses mock-ready data loaders and shared design tokens so it can evolve safely alongside the backend API.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

### 3. Start PostgreSQL

Use Docker:

```bash
docker compose up -d postgres
```

### 4. Generate Prisma client and run migrations

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 5. Run the apps

```bash
npm run dev
```

## API Summary

Public catalogue:

- `GET /api/v1/products`
- `GET /api/v1/products/:slug`
- `GET /api/v1/categories`
- `GET /api/v1/shortlist`
- `POST /api/v1/shortlist/items`
- `DELETE /api/v1/shortlist/items/:id`
- `POST /api/v1/requests`

Admin and staff:

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/admin/products`
- `POST /api/v1/admin/products`
- `PATCH /api/v1/admin/products/:id`
- `DELETE /api/v1/admin/products/:id`
- `POST /api/v1/admin/categories`
- `GET /api/v1/admin/requests`
- `PATCH /api/v1/admin/requests/:id/status`
- `POST /api/v1/admin/users`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/store`
- `PATCH /api/v1/admin/store`

Detailed contracts live in [apps/api/openapi/v1.yaml](/Users/harshitjain/Desktop/XV/dipshit/newcodex/apps/api/openapi/v1.yaml).

## Documentation Files

- [idea.md](/Users/harshitjain/Desktop/XV/dipshit/newcodex/idea.md)
- [useCaseDiagram.md](/Users/harshitjain/Desktop/XV/dipshit/newcodex/useCaseDiagram.md)
- [sequenceDiagram.md](/Users/harshitjain/Desktop/XV/dipshit/newcodex/sequenceDiagram.md)
- [classDiagram.md](/Users/harshitjain/Desktop/XV/dipshit/newcodex/classDiagram.md)
- [ErDiagram.md](/Users/harshitjain/Desktop/XV/dipshit/newcodex/ErDiagram.md)

## Future Improvements

- Real-time staff notification queue for new showroom requests
- Fine-grained field-level permissions per staff role
- Saved customer leads and repeat buyer intelligence
- Store-level subscriptions and super-admin billing flows
- CDN-backed media processing and async image derivatives
- Search indexing with Meilisearch or Elasticsearch
- Analytics warehouse exports and cohort dashboards
