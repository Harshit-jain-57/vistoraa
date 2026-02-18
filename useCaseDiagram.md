# Use Case Diagram

The diagram below shows the primary actors and their responsibilities in Vistora.

```mermaid
flowchart LR
  Customer[Customer]
  Staff[Staff]
  Admin[Admin / Owner]

  subgraph CustomerPortal[Customer Catalogue]
    UC1(Browse catalogue)
    UC2(Search products)
    UC3(Filter products)
    UC4(View product details)
    UC5(Add to shortlist)
    UC6(Remove from shortlist)
    UC7(Submit showroom request)
  end

  subgraph StaffConsole[Staff Dashboard]
    UC8(Login)
    UC9(View requests)
    UC10(Process request)
    UC11(Mark product availability)
    UC12(Update request status)
  end

  subgraph AdminConsole[Admin Platform]
    UC13(Login)
    UC14(Manage products)
    UC15(Manage categories)
    UC16(Manage visibility rules)
    UC17(Manage users and staff)
    UC18(Manage store settings)
    UC19(View analytics and reports)
    UC20(Manage media)
  end

  Customer --> UC1
  Customer --> UC2
  Customer --> UC3
  Customer --> UC4
  Customer --> UC5
  Customer --> UC6
  Customer --> UC7

  Staff --> UC8
  Staff --> UC9
  Staff --> UC10
  Staff --> UC11
  Staff --> UC12

  Admin --> UC13
  Admin --> UC14
  Admin --> UC15
  Admin --> UC16
  Admin --> UC17
  Admin --> UC18
  Admin --> UC19
  Admin --> UC20
```

## Notes

- Customers can complete the shortlist and request flow without creating a full account.
- Staff focus on operational request handling rather than catalogue administration.
- Owners and admins control sensitive information visibility and store configuration.
