# ER Diagram

The schema is intentionally store-aware so that multi-tenant SaaS expansion can happen later with minimal redesign.

```mermaid
erDiagram
  Store ||--o{ User : has
  Role ||--o{ User : assigns
  Store ||--o{ Product : owns
  Store ||--o{ Category : owns
  Category ||--o{ Category : parent_of
  Category ||--o{ Product : categorizes
  Product ||--o{ ProductImage : has
  Product ||--o{ ProductAttributeValue : has
  AttributeDefinition ||--o{ ProductAttributeValue : defines
  Store ||--o{ AttributeDefinition : owns
  Store ||--o{ Tag : owns
  Product ||--o{ ProductTag : maps
  Tag ||--o{ ProductTag : maps
  Store ||--o{ VisibilityRule : controls
  Store ||--o{ CustomerSession : tracks
  CustomerSession ||--o{ ShortlistItem : saves
  Product ||--o{ ShortlistItem : shortlisted_in
  CustomerSession ||--o{ ShowroomRequest : creates
  Store ||--o{ ShowroomRequest : receives
  ShowroomRequest ||--o{ ShowroomRequestItem : includes
  Product ||--o{ ShowroomRequestItem : snapshots
  Store ||--o{ AuditLog : logs
  User ||--o{ AuditLog : performs
  User ||--o{ RefreshToken : owns

  Store {
    string id PK
    string name
    string slug UK
    json themeConfig
    boolean isActive
  }

  User {
    string id PK
    string storeId FK
    string roleId FK
    string email
    string passwordHash
    boolean isActive
  }

  Product {
    string id PK
    string storeId FK
    string categoryId FK
    string sku
    string slug
    decimal visiblePrice
    decimal internalCost
    decimal margin
    boolean isPublic
    boolean isArchived
  }

  ShowroomRequest {
    string id PK
    string storeId FK
    string customerSessionId FK
    string requestNumber
    string status
  }
```

## Relationship Notes

- `Category.parentId` supports nested category trees and must be recursion-safe in service logic.
- `ProductTag` is the join table for the many-to-many relationship between products and tags.
- `ShowroomRequestItem` stores product snapshots so historical requests remain accurate even if products change later.
- `VisibilityRule` enables field-level public/internal response control.
