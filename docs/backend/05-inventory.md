# 📦 Module 04 – Inventory Management

## Overview

The **Inventory module** manages **material receipt, storage, movement, and consumption** across projects and locations.
It is tightly integrated with **Purchase**, **Workflow**, and **Accounts** modules and ensures:

* Accurate stock quantities
* Full audit traceability
* Zero negative stock
* Enterprise-grade locking & transactions

This module is **backend-complete (101%)** and **immutable** going forward.

---

## Core Concepts

| Concept                      | Description                                                |
| ---------------------------- | ---------------------------------------------------------- |
| **GRN (Goods Receipt Note)** | Entry point for stock coming from approved Purchase Orders |
| **Stock**                    | Current quantity per material per project per location     |
| **Stock Ledger**             | Immutable transaction log for every stock movement         |
| **Material Issue**           | Consumption of stock for site usage                        |
| **Stock Transfer**           | Movement of stock between locations                        |
| **QC Handling**              | Partial / full acceptance during GRN approval              |

---

## Data Model Summary

### 1️⃣ GRN (`grn`)

Represents material received against a Purchase Order.

**Key Fields**

* `grnNo` (unique)
* `projectId`
* `locationId`
* `poId`
* `receivedBy`
* `status`
* `billed` (used by Purchase Bills)

**Status Flow**

```
DRAFT → QC_PENDING → APPROVED / PARTIAL_APPROVED / REJECTED
```

---

### 2️⃣ GRN Line (`grn_line`)

Material-level receipt details.

| Field         | Meaning                 |
| ------------- | ----------------------- |
| `orderedQty`  | Qty ordered in PO       |
| `receivedQty` | Qty physically received |
| `acceptedQty` | Qty accepted after QC   |
| `rejectedQty` | Qty rejected            |

---

### 3️⃣ Stock (`stock`)

Represents **current available quantity**.

**Unique Constraint**

```
(projectId, locationId, materialId)
```

This guarantees **no duplicate stock rows**.

---

### 4️⃣ Stock Ledger (`stock_ledger`)

Immutable audit trail of all inventory movements.

**refType ENUM**

```
GRN
ISSUE
ISSUE_CANCEL
TRANSFER
```

Each ledger row records:

* Qty In / Qty Out
* Resulting balance
* Source reference (GRN / Issue / Transfer)

> ⚠️ Ledger is **append-only**. Never edited or deleted.

---

### 5️⃣ Material Issue (`material_issue`)

Represents consumption of stock.

**Status**

```
DRAFT → APPROVED → CANCELLED
```

Cancellation **automatically reverses stock** via ledger entries.

---

### 6️⃣ Stock Transfer (`stock_transfer`)

Moves stock between locations within the same project.

* Atomic transaction
* Dual ledger entries (OUT + IN)
* Zero data inconsistency possible

---

## Associations

```text
GRN ──▶ GRN Lines
GRN ──▶ Stock (+)
Material Issue ──▶ Stock (−)
Material Issue Cancel ──▶ Stock (+)
Stock Transfer ──▶ Stock (OUT → IN)
All actions ──▶ Stock Ledger
```

---

## API Reference

All routes are prefixed with:

```
/api/inventory
```

Authentication is mandatory for all endpoints.

---

## 🔹 GRN APIs

### Create GRN

```
POST /grn
Permission: inventory.create
```

**Body**

```json
{
  "projectId": 1,
  "locationId": 2,
  "poId": 10,
  "lines": [
    {
      "poLineId": 5,
      "materialId": 3,
      "orderedQty": 100,
      "receivedQty": 95,
      "acceptedQty": 90,
      "rejectedQty": 5
    }
  ]
}
```

✔ Validates approved PO
✔ Status set to `QC_PENDING`

---

### Approve GRN

```
PUT /grn/:id/approve
Permission: inventory.approve
```

**Behavior**

* Validates quantities
* Updates stock
* Creates ledger entries
* Sets status:

  * `APPROVED` (all accepted)
  * `PARTIAL_APPROVED` (partial acceptance)

---

## 🔹 Material Issue APIs

### Issue Material

```
POST /issue
Permission: inventory.issue
```

**Body**

```json
{
  "projectId": 1,
  "fromLocationId": 2,
  "purpose": "Site work",
  "lines": [
    {
      "materialId": 3,
      "issuedQty": 20
    }
  ]
}
```

✔ Stock locked
✔ No negative stock allowed
✔ Ledger entry created

---

### Cancel Material Issue

```
PUT /issue/:id/cancel
Permission: inventory.approve
```

✔ Fully reverses stock
✔ Creates `ISSUE_CANCEL` ledger entry

---

## 🔹 Stock Transfer APIs

### Transfer Stock

```
POST /transfer
Permission: inventory.transfer
```

**Body**

```json
{
  "projectId": 1,
  "fromLocationId": 1,
  "toLocationId": 2,
  "lines": [
    {
      "materialId": 5,
      "transferQty": 10
    }
  ]
}
```

✔ Atomic transaction
✔ Dual ledger entries
✔ No stock mismatch possible

---

## 🔹 Reporting APIs

### Get Stock

```
GET /stock
Permission: inventory.view
```

**Optional Filters**

```
?projectId=
&locationId=
&materialId=
```

---

### Get Stock Ledger

```
GET /ledger
Permission: inventory.view
```

**Optional Filters**

```
?projectId=
&locationId=
&materialId=
&refType=
```

---

## Transactions & Safety

* All write operations use **DB transactions**
* Rows are locked using `SELECT … FOR UPDATE`
* Zero race conditions
* Zero negative stock risk

---

## Audit Logging

Every critical action logs:

* User ID
* Action name
* Module = `INVENTORY`
* Record ID

Examples:

* `CREATE_GRN`
* `APPROVE_GRN`
* `ISSUE_MATERIAL`
* `CANCEL_MATERIAL_ISSUE`
* `TRANSFER_STOCK`

---

## Integration Points

| Module    | Integration                 |
| --------- | --------------------------- |
| Purchase  | GRN requires approved PO    |
| Workflow  | Approval checks             |
| Accounts  | Purchase Bill uses GRN      |
| Dashboard | Stock & consumption metrics |

---

## Final Status

✅ **Backend Complete**
✅ **Enterprise-Safe**
✅ **No Pending APIs**
✅ **Frontend-Ready**
✅ **No Future Refactor Required**
