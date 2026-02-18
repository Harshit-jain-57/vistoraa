# Vistora

## Problem Statement

Wholesale textile stores often serve many walk-in buyers at once. Customers ask to see a large number of products manually, which creates crowding, delays, staff fatigue, weak product discovery, and lost sales opportunities.

## Proposed Solution

Vistora digitizes the in-store discovery process. Customers can browse a store-specific catalogue on their phone, tablet, kiosk, or showroom screen, shortlist products, and submit a request for staff to physically show those items. Sensitive commercial information stays hidden behind a secure admin/staff layer.

## Target Users

- Walk-in customers and visiting wholesale buyers
- Floor staff and sales associates
- Store owners and admins
- Future SaaS super admins managing multiple stores

## Scope

### In Scope

- Public catalogue browsing
- Search, filter, and category exploration
- Product detail pages
- Session-based shortlist flow
- Showroom request submission
- Admin login and RBAC
- Product, category, and staff management
- Visibility rule management
- Store configuration and branding
- Audit-friendly backend architecture

### Out of Scope for V1

- Online checkout and payments
- Shipping and logistics
- Supplier portals
- AI as a core dependency
- Deep CRM/ERP integrations

## Core Features

- Store-branded digital catalogue
- Public/internal field visibility controls
- Product variants, attributes, tags, and media
- Session-aware shortlisting for anonymous customers
- Staff picking workflows for showroom requests
- Owner-only access to internal cost, margin, supplier data, and private notes
- Structured APIs with pagination, validation, and security middleware

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Auth: JWT access + refresh tokens
- Logging: Pino
- Testing: Jest and Supertest
- Docs: Mermaid diagrams and OpenAPI
- DevOps: Docker and npm workspaces

## Architecture Overview

Vistora uses a layered modular backend:

- Controllers handle transport concerns
- Services own business rules and orchestration
- Repositories isolate data access
- Policies shape data visibility per role
- Middleware enforces auth, RBAC, validation, and error handling

The schema is store-aware so a single codebase can support multiple tenants in the future without redesigning core tables.

## Why This Is Backend-Focused

The strongest engineering weight sits in the backend:

- Rich domain model with role-based field visibility
- Multi-tenant ready schema design
- Request snapshotting and audit logging
- Secure auth and refresh-token strategy
- Policy-driven response shaping
- Clean module boundaries and scalable service design

## Future Scope

- Multi-store SaaS onboarding
- Subscription plans and billing
- Notification workflows
- Inventory integrations
- Sales analytics and buyer heatmaps
- Search indexing and recommendations
