# Sequence Diagram

## Main Customer-to-Staff Flow

```mermaid
sequenceDiagram
  autonumber
  actor Customer
  participant Frontend as Customer Frontend
  participant API as Vistora API
  participant ProductService as ProductService
  participant Visibility as VisibilityPolicyService
  participant DB as PostgreSQL
  participant StaffUI as Staff Dashboard

  Customer->>Frontend: Open catalogue
  Frontend->>API: GET /api/v1/products?category=sarees&page=1
  API->>ProductService: listPublicProducts(filters, store)
  ProductService->>DB: Query store-scoped public products
  DB-->>ProductService: Product rows + relations
  ProductService->>Visibility: shapeProductsForPublic(products)
  Visibility-->>ProductService: Sanitized catalogue DTOs
  ProductService-->>API: Paginated response
  API-->>Frontend: 200 product list

  Customer->>Frontend: Add item to shortlist
  Frontend->>API: POST /api/v1/shortlist/items
  API->>DB: Upsert customer session + shortlist item
  DB-->>API: Shortlist updated
  API-->>Frontend: 201 item added

  Customer->>Frontend: Submit showroom request
  Frontend->>API: POST /api/v1/requests
  API->>DB: Validate session, shortlist, and availability
  API->>DB: Create showroom request + snapshot items
  DB-->>API: Request created
  API-->>Frontend: 201 request number

  StaffUI->>API: GET /api/v1/admin/requests
  API->>DB: Fetch pending store requests
  DB-->>API: Request list
  API-->>StaffUI: 200 requests

  StaffUI->>API: PATCH /api/v1/admin/requests/:id/status
  API->>DB: Update status to PICKING / READY_TO_SHOW
  DB-->>API: Status updated
  API-->>StaffUI: 200 success
```

## Supporting Sequences

### Admin Login

1. Admin submits email and password.
2. `AuthService` validates credentials and user status.
3. `JwtService` issues an access token and refresh token.
4. Refresh token hash is persisted for revocation and rotation.

### Product Creation / Update

1. Admin submits a typed payload.
2. Validation middleware sanitizes and validates the request.
3. `ProductService` checks store-scoped uniqueness for SKU and slug.
4. Prisma transaction updates product, tags, attributes, and images.
5. `AuditService` stores before/after metadata.

### Visibility Rule Enforcement

1. Product data is fetched with related category, images, and tags.
2. `VisibilityPolicyService` receives the viewer role context.
3. Hidden fields such as `internalCost`, `margin`, and `supplierName` are removed for public responses.
4. Staff/admin payloads are shaped according to role permissions.
