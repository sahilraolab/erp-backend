# Module 06 – Contracts

## Overview

The **Contracts module** manages all contractor-related commercial activities including:

* Contractors & labour rates
* Work Orders (WO) with revisions
* Running Account (RA) Bills
* Advances, retention & recoveries
* Debit / Credit Notes
* Full workflow approval integration
* Posting to Accounts module
* Engineering BOQ (BBS) quantity control

This module is **financially critical** and enforces:

* Single source of truth
* Workflow gating
* Audit logging
* Transaction safety

---

## Core Entities

### 1️⃣ Contractor

**Purpose:** Master record for contractors.

**Model:** `contractor`

**Fields**

| Field         | Type    |
| ------------- | ------- |
| id            | PK      |
| name          | string  |
| gstNo         | string  |
| contactPerson | string  |
| phone         | string  |
| isActive      | boolean |

**Endpoints**

```http
POST   /contracts/contractors
GET    /contracts/contractors
```

---

### 2️⃣ Labour Rate

**Purpose:** Contractor-specific labour pricing.

**Model:** `labour_rate`

**Fields**

| Field        | Type   |
| ------------ | ------ |
| contractorId | FK     |
| labourType   | string |
| ratePerDay   | number |

**Endpoint**

```http
POST /contracts/labour-rates
```

---

## Work Orders (WO)

### 3️⃣ Work Order

**Purpose:** Legal contract with a contractor.

**Model:** `work_order`

**Key Fields**

| Field            | Notes                                |
| ---------------- | ------------------------------------ |
| woNo             | Auto-generated                       |
| projectId        | Required                             |
| contractorId     | Required                             |
| totalValue       | Contract value                       |
| retentionPercent | Default 5%                           |
| status           | DRAFT / APPROVED / CLOSED            |
| locked           | Prevents modification after approval |

---

### 4️⃣ Work Order Line

**Model:** `work_order_line`

**Key Fields**

| Field       | Notes                     |
| ----------- | ------------------------- |
| bbsId       | Engineering BOQ link      |
| qty         | Contract quantity         |
| rate        | Agreed rate               |
| executedQty | Auto-updated via RA Bills |

> `amount = qty × rate` (auto-calculated)

---

### 5️⃣ Work Order Revision

**Purpose:** Tracks WO value changes.

**Rules**

* Only **APPROVED** Work Orders can be revised
* Revision numbers auto-increment
* Updates Work Order total value

**Model:** `work_order_revision`

---

### Work Order APIs

```http
POST   /contracts/work-orders
PUT    /contracts/work-orders/:id/approve
POST   /contracts/work-orders/revise
GET    /contracts/work-orders
```

**Workflow**

* Creation → Workflow starts
* Approval → `locked = true`
* Revision → New revision record created

---

## RA Bills (Running Account Bills)

### 6️⃣ RA Bill

**Purpose:** Periodic contractor billing.

**Model:** `ra_bill`

**Key Fields**

| Field            | Notes                     |
| ---------------- | ------------------------- |
| workOrderId      | FK                        |
| billNo           | Auto-generated            |
| grossAmount      | Calculated                |
| retentionAmount  | Calculated                |
| advanceRecovery  | Calculated                |
| netPayable       | Final                     |
| isFinalBill      | Boolean                   |
| status           | DRAFT / APPROVED / POSTED |
| postedToAccounts | Boolean                   |

---

### 7️⃣ RA Bill Line

**Model:** `ra_bill_line`

**Key Logic**

* `totalQty = previousQty + currentQty`
* `amount = currentQty × rate`
* Over-billing is **blocked**
* BOQ consumption enforced

---

### RA Bill Rules (Critical)

✔ Only **one pending RA Bill** per Work Order
✔ Engineering BOQ (BBS) is the **single source of truth**
✔ Executed quantity cannot exceed WO quantity
✔ RA Bills are workflow controlled
✔ Posting is irreversible

---

### RA Bill APIs

```http
POST   /contracts/ra-bills
PUT    /contracts/ra-bills/:id/approve
PUT    /contracts/ra-bills/:id/post
GET    /contracts/ra-bills
```

---

## Advances

### 8️⃣ Advance

**Purpose:** Mobilization / financial advance to contractor.

**Rules**

* Allowed **only for APPROVED Work Orders**
* Auto-calculates balance
* Recovered during RA posting

**Model:** `advance`

**Fields**

| Field          | Notes           |
| -------------- | --------------- |
| amount         | Advance issued  |
| adjustedAmount | Recovered       |
| balanceAmount  | Auto-calculated |

**API**

```http
POST /contracts/advances
```

---

## Debit / Credit Notes

### 9️⃣ Debit / Credit Note

**Purpose:** Adjustments outside RA Bills.

**Model:** `debit_credit_note`

**Types**

* DEBIT → Contractor payable increases
* CREDIT → Contractor payable reduces

**Rules**

* Workflow approval mandatory
* Posting creates JV entry
* Cannot be reposted

**APIs**

```http
POST /contracts/dc-notes
PUT  /contracts/dc-notes/:id/post
```

---

## Workflow Integration

All critical entities are workflow-controlled:

| Entity            | Workflow Key |
| ----------------- | ------------ |
| Work Order        | WORK_ORDER   |
| RA Bill           | RA_BILL      |
| Debit/Credit Note | DC_NOTE      |

Approval is enforced via:

```js
ensureApproved(module, entity, recordId)
```

---

## Accounts Integration

Posting uses **Accounts module** via:

```js
posting.postVoucher()
```

### Posting Scenarios

| Action      | Entry                                 |
| ----------- | ------------------------------------- |
| RA Bill     | Construction WIP → Contractor Payable |
| Debit Note  | Expense → Payable                     |
| Credit Note | Payable → Expense                     |

---

## Engineering Integration (BOQ Control)

* RA Bills **consume BBS quantities**
* Over-consumption is blocked
* Engineering module is the **single source of truth**

---

## Audit Trail

All major actions are audited:

* Contractor creation
* Work Order creation & revision
* RA Bill creation
* Site posting events
