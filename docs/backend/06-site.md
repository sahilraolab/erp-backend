# 📘 Module 05 – Site Management

## Overview

The **Site module** manages all **on-site operations** in a construction project, including:

* Site master data
* Site material stock & ledger
* Site requisitions
* Site GRNs (receipts at site)
* Store ↔ Site & Site ↔ Site transfers
* DPR (Daily Progress Report)
* WPR (Weekly Progress Report)
* Muster (Labour attendance)

This module is **fully integrated** with:

* **Inventory** (store stock & ledger)
* **Engineering** (BBS / BOQ consumption)
* **Workflow & Audit**
* **Purchase** (material flow continuity)

---

## Core Design Principles

* 🔒 **Transactional integrity** using DB transactions & row locks
* 🔄 **Bidirectional stock movement** (Store ↔ Site ↔ Site)
* 📊 **Ledger-driven stock accounting**
* 🧱 **Engineering-locked progress reporting**
* 🧾 **Audit for every state-changing action**
* 🚫 No hard deletes, only lifecycle states

---

## Entity Relationship Summary

```
Site
 ├─ SiteStock
 │   └─ SiteStockLedger
 ├─ SiteRequisition
 │   └─ SiteRequisitionLine
 ├─ SiteGRN
 │   └─ SiteGRNLine
 ├─ SiteTransfer
 │   └─ SiteTransferLine
 ├─ DPR
 │   └─ DPRLine (BBS-linked)
 ├─ WPR
 └─ Muster
```

---

## Models

### 1️⃣ Site (`site`)

Defines a physical construction site under a project.

**Key fields**

* `projectId`
* `name`
* `code` (auto-generated)
* `isActive`

**Rules**

* `code` auto-generated on create
* Sites are never deleted (soft lifecycle)

---

### 2️⃣ Site Stock (`site_stock`)

Represents **current material quantity at a site**.

**Unique Constraint**

```
(siteId, materialId)
```

**Fields**

* `siteId`
* `materialId`
* `quantity`

---

### 3️⃣ Site Stock Ledger (`site_stock_ledger`)

Immutable stock movement ledger for site inventory.

**refType ENUM**

* `SITE_GRN`
* `SITE_TRANSFER`
* `ISSUE`

**Fields**

* `siteId`
* `materialId`
* `refType`
* `refId`
* `qtyIn`
* `qtyOut`
* `balanceQty`

---

### 4️⃣ Site Requisition (`site_requisition`)

Material demand raised by a site.

**Lifecycle**

```
DRAFT → SUBMITTED → APPROVED
```

**Fields**

* `srNo`
* `projectId`
* `siteId`
* `requestedBy`
* `status`

---

### 5️⃣ Site Requisition Line (`site_requisition_line`)

Line items for site requisition.

**Fields**

* `requisitionId`
* `materialId`
* `requiredQty`

---

### 6️⃣ Site GRN (`site_grn`)

Receipt of materials **at site**, either from:

* Central store
* Another site

**Fields**

* `siteGrnNo`
* `projectId`
* `siteId`
* `sourceType` → `STORE | SITE`
* `sourceRefId`
* `receivedBy`
* `status` → `QC_PENDING | APPROVED`

---

### 7️⃣ Site GRN Line (`site_grn_line`)

**Fields**

* `siteGrnId`
* `materialId`
* `receivedQty`

---

### 8️⃣ Site Transfer (`site_transfer`)

Unified transfer entity for **any movement**:

* Store → Site
* Site → Store
* Site → Site

**Fields**

* `transferNo`
* `projectId`
* `fromType` (`STORE | SITE`)
* `fromRefId`
* `toType` (`STORE | SITE`)
* `toRefId`
* `requestedBy`
* `approvedBy`
* `status` → `DRAFT | APPROVED`

---

### 9️⃣ Site Transfer Line (`site_transfer_line`)

**Fields**

* `transferId`
* `materialId`
* `qty`

---

### 🔟 DPR – Daily Progress Report (`dpr`)

Records daily execution progress.

**Constraints**

```
UNIQUE (siteId, date)
```

**Fields**

* `projectId`
* `siteId`
* `date`
* `remarks`

---

### 1️⃣1️⃣ DPR Line (`dpr_line`)

Linked to **Engineering BBS**.

**Fields**

* `dprId`
* `bbsId`
* `qty`
* `activity`
* `unit`

**Rule**

* Consumes BBS quantity via Engineering module

---

### 1️⃣2️⃣ WPR – Weekly Progress Report (`wpr`)

**Fields**

* `projectId`
* `siteId`
* `weekStart`
* `weekEnd`
* `summary`

---

### 1️⃣3️⃣ Muster (`muster`)

Daily labour attendance.

**Constraint**

```
UNIQUE (siteId, date)
```

**Fields**

* `projectId`
* `siteId`
* `date`
* `labourCount`

---

## Services

### Site Stock Service (`site.service.js`)

#### `addStock()`

* Creates or updates site stock
* Writes ledger entry
* Transaction-safe

#### `removeStock()`

* Validates available quantity
* Deducts stock
* Writes ledger entry

---

## Controllers & APIs

### 🔹 Site Requisition

| Action  | Method | Endpoint                         |
| ------- | ------ | -------------------------------- |
| Create  | POST   | `/site/requisitions`             |
| Submit  | PUT    | `/site/requisitions/:id/submit`  |
| Approve | PUT    | `/site/requisitions/:id/approve` |
| List    | GET    | `/site/requisitions`             |

---

### 🔹 Site GRN

| Action  | Method | Endpoint                |
| ------- | ------ | ----------------------- |
| Create  | POST   | `/site/grn`             |
| Approve | PUT    | `/site/grn/:id/approve` |
| List    | GET    | `/site/grn`             |

**Approval logic**

* Deducts stock from source (STORE/SITE)
* Adds stock to destination site
* Ledger written for both sides

---

### 🔹 Site Transfers

| Action  | Method | Endpoint                      |
| ------- | ------ | ----------------------------- |
| Create  | POST   | `/site/transfers`             |
| Approve | PUT    | `/site/transfers/:id/approve` |
| List    | GET    | `/site/transfers`             |

---

### 🔹 Reports

| Report | Method | Endpoint       |
| ------ | ------ | -------------- |
| DPR    | POST   | `/site/dpr`    |
| WPR    | POST   | `/site/wpr`    |
| Muster | POST   | `/site/muster` |

---

### 🔹 Stock Visibility

| Action     | Method | Endpoint              |
| ---------- | ------ | --------------------- |
| Site Stock | GET    | `/site/stock?siteId=` |

---

## Engineering Integration

* DPR consumes **BBS quantities**
* Prevents over-execution
* Fully transactional
* Shared budget discipline with Purchase

---

## Audit Coverage

Every action logs audit:

* CREATE_SR / SUBMIT_SR / APPROVE_SR
* CREATE_SITE_GRN / APPROVE_SITE_GRN
* CREATE_TRANSFER / APPROVE_TRANSFER
* CREATE_DPR / CREATE_WPR / CREATE_MUSTER
