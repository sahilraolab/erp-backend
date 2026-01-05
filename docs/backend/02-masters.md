# 📘 Module 02 – Masters

**File:** `/docs/backend/02-masters.md`
**Status:** ✅ FINAL & LOCKED
**Audience:** Backend reference, Frontend/API integration, AI UI generation

---

## 1️⃣ Purpose of Masters Module

The **Masters module** provides all **static and semi-static reference data** required across the ERP system.

These entities are:

* Centrally managed
* Permission protected
* Soft-deleted (no hard deletes)
* Audit logged
* Reused across all operational modules

> **Rule:**
> No transaction module (Purchase, Inventory, Accounts, etc.) can exist without Masters.

---

## 2️⃣ Entities Covered

| Entity      | Description                             |
| ----------- | --------------------------------------- |
| Company     | Legal entity owning projects            |
| Project     | Execution unit under a company          |
| Material    | Item catalog used in BOQ, MR, Purchase  |
| Supplier    | Vendor / contractor master              |
| UOM         | Unit of Measurement                     |
| Department  | Internal organization units             |
| Cost Center | Budget & accounting grouping            |
| Tax         | Tax definitions for purchase & accounts |

---

## 3️⃣ Common Design Principles (Applies to All Masters)

### 🔐 Security

* All routes protected via `auth.middleware`
* Permission-based access:

  * `masters.create`
  * `masters.view`
  * `masters.update`
  * `masters.delete`

### 🧾 Audit

Every **CREATE / UPDATE / DELETE** action:

* Logged in `audit_logs`
* Captures:

  * userId
  * module
  * action
  * recordId
  * timestamp

### 🗑 Soft Delete

* No master data is hard deleted
* `isActive = false` used instead
* Deleted records never appear in list APIs

### 🔢 Auto Code Generation

Some entities generate codes automatically using:

```
core/codeGenerator.js
```

Format:

```
PREFIX-0001
```

---

## 4️⃣ Models & Fields

### 4.1 Company

**Purpose:** Legal organization

**Auto Code:** `CMP-0001`

| Field        | Type                    |
| ------------ | ----------------------- |
| id           | PK                      |
| name         | string                  |
| code         | string (unique, auto)   |
| phone        | string                  |
| email        | string                  |
| gstin        | string                  |
| pan          | string                  |
| addressLine1 | string                  |
| addressLine2 | string                  |
| city         | string                  |
| state        | string                  |
| pincode      | string                  |
| country      | string (default: India) |
| currency     | string (default: INR)   |
| isActive     | boolean                 |

---

### 4.2 Project

**Purpose:** Execution unit under a company
**Auto Code:** `PRJ-0001`

| Field          | Type                                        |
| -------------- | ------------------------------------------- |
| id             | PK                                          |
| name           | string                                      |
| code           | string (auto)                               |
| companyId      | FK → Company                                |
| budget         | decimal                                     |
| startDate      | date                                        |
| endDate        | date                                        |
| status         | ENUM (PLANNED, ONGOING, ON_HOLD, COMPLETED) |
| address fields | structured                                  |
| description    | text                                        |
| isActive       | boolean                                     |

---

### 4.3 Material

**Purpose:** Item catalog
**Auto Code:** `MAT-0001`

| Field         | Type          |
| ------------- | ------------- |
| id            | PK            |
| name          | string        |
| code          | string (auto) |
| category      | string        |
| uomId         | FK → UOM      |
| sizeValue     | decimal       |
| sizeUnit      | string        |
| specification | string        |
| hsnCode       | string        |
| description   | text          |
| isActive      | boolean       |

---

### 4.4 Supplier

**Purpose:** Vendor / Supplier
**Auto Code:** `SUP-0001`

| Field          | Type          |
| -------------- | ------------- |
| id             | PK            |
| name           | string        |
| code           | string (auto) |
| contactPerson  | string        |
| phone          | string        |
| email          | string        |
| gstin          | string        |
| pan            | string        |
| address fields | structured    |
| country        | string        |
| isActive       | boolean       |

**Used by:**

* Purchase RFQ
* Supplier Portal
* Quotation
* Purchase Order

---

### 4.5 UOM (Unit of Measurement)

**Purpose:** Measurement units

| Field       | Type            |
| ----------- | --------------- |
| id          | PK              |
| code        | string (unique) |
| name        | string          |
| description | text            |
| isActive    | boolean         |

---

### 4.6 Department

**Purpose:** Internal organization unit

| Field          | Type    |
| -------------- | ------- |
| id             | PK      |
| code           | string  |
| name           | string  |
| departmentHead | string  |
| description    | text    |
| isActive       | boolean |

---

### 4.7 Cost Center

**Purpose:** Budget & accounting grouping

| Field       | Type    |
| ----------- | ------- |
| id          | PK      |
| code        | string  |
| name        | string  |
| budget      | decimal |
| description | text    |
| isActive    | boolean |

---

### 4.8 Tax

**Purpose:** Tax configuration

| Field       | Type                                           |
| ----------- | ---------------------------------------------- |
| id          | PK                                             |
| code        | string                                         |
| name        | string                                         |
| rate        | decimal                                        |
| type        | ENUM (GST, CGST, SGST, IGST, VAT, CESS, OTHER) |
| accountId   | integer (future ledger mapping)                |
| description | text                                           |
| isActive    | boolean                                        |

---

## 5️⃣ Associations

| Relationship                  |
| ----------------------------- |
| Company → hasMany → Projects  |
| Project → belongsTo → Company |
| UOM → hasMany → Materials     |
| Material → belongsTo → UOM    |
| Supplier → hasMany → Users    |

---

## 6️⃣ API Endpoints

### Base Path

```
/masters
```

### Pattern (Same for All Entities)

| Action        | Method | Path          |
| ------------- | ------ | ------------- |
| Create        | POST   | /{entity}     |
| List          | GET    | /{entity}     |
| Get One       | GET    | /{entity}/:id |
| Update        | PUT    | /{entity}/:id |
| Delete (Soft) | DELETE | /{entity}/:id |

### Example

```
POST   /masters/materials
GET    /masters/materials
PUT    /masters/materials/5
DELETE /masters/materials/5
```

---

## 7️⃣ Controller Architecture

* Single **generic CRUD factory**
* Eliminates duplication
* Centralizes:

  * Audit logging
  * Soft delete
  * Protected fields
  * Permissions

This pattern is **intentionally reusable** in:

* Accounts masters
* Workflow masters
* Config modules

---

## 8️⃣ Excel Import / Export Readiness

The design already supports:

* `.xlsx` imports
* Bulk inserts
* Transaction rollback
* Validation before save

⚠ No backend changes needed for Excel support later.

---

## 9️⃣ What This Module Does NOT Do (By Design)

❌ No hard deletes
❌ No transactional logic
❌ No approval workflows
❌ No document uploads

Those belong to **Purchase / Engineering / Accounts**
