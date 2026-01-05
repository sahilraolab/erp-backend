# 📘 Module 01 — Auth & Admin

**Construction ERP Backend**

**Status:** ✅ FINAL & LOCKED
**Audience:** Backend, Frontend, AI UI tools, Future Maintainers
**Dependency Level:** Core (used by all modules)

---

## 1️⃣ Module Purpose

This module provides:

* Authentication (JWT-based)
* Role & permission management
* User management (internal + supplier users)
* Supplier-user linking
* Authorization middleware
* Audit logging (system-wide)

This module is **foundational**.
All other modules depend on it.

---

## 2️⃣ Authentication Architecture

### 🔐 Authentication Method

* JWT (Bearer token)
* Stateless
* 1-day expiry
* Signed with `JWT_SECRET`

### 🧠 Token Payload

```json
{
  "id": 12,
  "role": "SUPPLIER",
  "supplierId": 5
}
```

| Field      | Description                 |
| ---------- | --------------------------- |
| id         | Logged-in user ID           |
| role       | Role name (UPPERCASE)       |
| supplierId | Supplier context (nullable) |

---

## 3️⃣ Database Models

### 3.1 User (`users`)

Represents **all system users**:

* Admins
* Internal staff
* Supplier portal users

```ts
User {
  id
  name
  email (unique)
  phone
  password (hashed)
  roleId
  departmentId (nullable)
  supplierId (nullable)
  isActive
  createdAt
  updatedAt
}
```

**Associations**

* `User → Role`
* `User → Department`
* `User → Supplier (optional)`

📌 **Key Design Rule**
Supplier users are NOT separate entities.
They are normal users with `supplierId`.

---

### 3.2 Role (`roles`)

```ts
Role {
  id
  name (unique, UPPERCASE)
  description
}
```

Examples:

* `SUPER_ADMIN`
* `SUPPLIER`

---

### 3.3 Permission (`permissions`)

```ts
Permission {
  id
  key (unique)
  module
  action
  description
}
```

Example keys:

* `admin.users.view`
* `supplier.rfq.view`
* `purchase.create`

---

### 3.4 RolePermission (`role_permissions`)

Many-to-many mapping.

```ts
role_permissions {
  roleId
  permissionId
}
```

---

### 3.5 Password Reset (`password_resets`)

```ts
PasswordReset {
  id
  userId
  token
  expiresAt
  used
}
```

Used for secure password recovery.

---

### 3.6 Audit Log (`audit_logs`)

```ts
AuditLog {
  id
  userId
  action
  module
  recordId
  meta (JSON)
  createdAt
}
```

Used across **all modules**.

---

## 4️⃣ Authorization & Middleware

### 🔒 Auth Middleware

```js
auth(requiredPermission)
```

#### Behavior

1. Validates JWT
2. Loads user + role + permissions
3. Verifies `isActive`
4. Checks permission (if required)
5. Attaches `req.user`

#### Permission Check

```js
auth("supplier.rfq.view")
```

✔ Centralized
✔ No hardcoded role checks
✔ Permission-driven system

---

## 5️⃣ API Endpoints

### 5.1 Auth Routes (`/auth`)

| Method | Endpoint                | Description          |
| ------ | ----------------------- | -------------------- |
| POST   | `/auth/login`           | Login                |
| POST   | `/auth/forgot-password` | Generate reset token |
| POST   | `/auth/logout`          | Logout               |
| GET    | `/auth/me`              | Current user profile |
| PUT    | `/auth/me`              | Update profile       |
| PUT    | `/auth/me/password`     | Change password      |

---

### 5.2 Admin Routes (`/admin`)

#### Users

| Method | Endpoint           | Permission           |
| ------ | ------------------ | -------------------- |
| POST   | `/admin/users`     | `admin.users.manage` |
| GET    | `/admin/users`     | `admin.users.view`   |
| PUT    | `/admin/users/:id` | `admin.users.manage` |

#### Roles & Permissions

| Method | Endpoint                       | Permission           |
| ------ | ------------------------------ | -------------------- |
| POST   | `/admin/roles`                 | `admin.roles.manage` |
| GET    | `/admin/roles`                 | `admin.roles.view`   |
| POST   | `/admin/roles/:id/permissions` | `admin.roles.manage` |

#### Audit

| Method | Endpoint            | Permission         |
| ------ | ------------------- | ------------------ |
| GET    | `/admin/audit-logs` | `admin.audit.view` |

---

## 6️⃣ Supplier User Architecture

### ✅ Supplier User Rules

* Supplier users are **Users**
* Identified via `supplierId`
* Permissions restrict access
* No separate auth flow

### Example Supplier User

```json
{
  "email": "supplier@erp.com",
  "role": "SUPPLIER",
  "supplierId": 3
}
```

Used by:

* Supplier Portal
* Supplier RFQs
* Supplier Quotations

---

## 7️⃣ Permissions Matrix (Core)

### Supplier Permissions

```text
supplier.view
supplier.rfq.view
supplier.quotation.create
supplier.quotation.view
```

### Admin Permissions

```text
admin.users.view
admin.users.manage
admin.roles.view
admin.roles.manage
admin.audit.view
```

---

## 8️⃣ Seeding Strategy

### Seed Files

* `seed.admin.js`
* `seed.masters.js`

### Seeded Automatically

* Permissions
* SUPER_ADMIN role
* SUPPLIER role
* Super admin user
* Sample supplier user

📌 Safe to re-run (idempotent).

---

## 9️⃣ Audit Coverage

Audited actions include:

* LOGIN / LOGOUT
* CREATE_USER
* UPDATE_USER
* CREATE_ROLE
* ASSIGN_PERMISSIONS
* PROFILE UPDATES
* PASSWORD CHANGES
* Supplier quotations (later modules)

Audit is **non-blocking** and **transaction-safe**.

---

## 🔒 Module Lock Declaration

> **This module is COMPLETE and MUST NOT be modified**
> unless a breaking auth change is required.

All future modules must:

* Use `req.user`
* Use permission keys
* Log via `audit()`

