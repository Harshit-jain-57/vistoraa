# Class Diagram

The class diagram focuses on key backend application classes and their dependencies.

```mermaid
classDiagram
  class BaseResponseBuilder {
    +success(data, message)
    +paginated(items, pagination, message)
    +error(code, message, details)
  }

  class AppError {
    +statusCode: number
    +code: string
    +details: unknown
  }

  class JwtService {
    +generateAccessToken(payload)
    +generateRefreshToken(payload)
    +verifyAccessToken(token)
    +verifyRefreshToken(token)
  }

  class ValidationMiddleware {
    +handle(schema)
  }

  class BaseRepository {
    #prisma
    #withStoreScope(storeId, where)
  }

  class AuthController
  class AuthService
  class UserRepository

  class ProductController
  class ProductService
  class ProductRepository
  class VisibilityPolicyService

  class CategoryService
  class RequestService
  class RequestRepository
  class MediaService
  class AuditService

  class IProductRepository {
    <<interface>>
    +findPublicCatalogue()
    +findBySlug()
    +create()
    +update()
  }

  class IStorageProvider {
    <<interface>>
    +upload(file)
    +remove(key)
  }

  AuthController --> AuthService
  AuthService --> UserRepository
  AuthService --> JwtService
  AuthService --> AuditService

  ProductController --> ProductService
  ProductService --> IProductRepository
  ProductService --> VisibilityPolicyService
  ProductService --> AuditService
  ProductRepository ..|> IProductRepository
  ProductRepository --|> BaseRepository

  CategoryService --> BaseRepository
  RequestService --> RequestRepository
  RequestService --> AuditService

  MediaService --> IStorageProvider
  ValidationMiddleware --> AppError
  AuthController --> BaseResponseBuilder
  ProductController --> BaseResponseBuilder
```

## OOP Notes

- Controllers encapsulate transport logic and delegate domain behavior.
- Services provide abstraction boundaries for business workflows.
- Repositories hide Prisma details behind stable contracts.
- Interfaces keep storage and data-access strategies swappable.
- Shared base classes reduce repetitive infrastructure code without overusing inheritance.
