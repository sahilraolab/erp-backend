# 📊 Module 10 – Dashboard & MIS

---

## 1. PURPOSE OF THIS MODULE

The **Dashboard & MIS module** provides:

* Read-only, role-based dashboards
* Pre-computed KPIs (NO runtime calculations)
* High-performance reporting
* A **single source of truth** for management metrics

### 🔑 Core Rule

> **Dashboard NEVER reads live transactional tables**
> It reads ONLY from **MIS snapshot tables**

This guarantees:

* No performance impact
* No inconsistent numbers
* No business logic duplication

---

## 2. HIGH-LEVEL ARCHITECTURE

```
Transactional Modules
(Purchase, Inventory, Accounts, Contracts, Site)
        ↓
     MIS Services
(snapshot generation jobs)
        ↓
   MIS Snapshot Tables
        ↓
     Dashboard APIs
        ↓
        UI
```

---

## 3. CORE PRINCIPLES (VERY IMPORTANT)

1. **Snapshot-based**

   * Metrics are calculated once
   * Stored permanently per date + project

2. **Role-filtered**

   * Each role sees only allowed KPIs

3. **Read-only**

   * No updates via Dashboard APIs

4. **Idempotent**

   * Snapshot jobs can be safely re-run

---

## 4. MODULE STRUCTURE

### Dashboard

```
src/modules/dashboard/
├── dashboard.routes.js
└── dashboard.service.js
```

### MIS

```
src/modules/mis/
├── kpi.config.js
├── mis.controller.js
├── mis.routes.js
├── mis.service.js
├── misBudget.controller.js
├── misBudget.service.js
├── misBudgetSnapshot.model.js
├── misProcurement.controller.js
├── misProcurement.service.js
├── misProcurementSnapshot.model.js
└── misSnapshot.model.js
```

---

## 5. KPI CONFIGURATION (ROLE-BASED VISIBILITY)

### File: `kpi.config.js`

Defines **which KPIs are visible to which role**

```js
ADMIN: [
  'cashBalance',
  'totalPurchase',
  'stockValue',
  'contractorOutstanding'
]
```

Other roles:

* PROJECT_MANAGER
* ACCOUNTS
* STORE

📌 This is the **ONLY place** where dashboard visibility is controlled
📌 No hardcoding in services or UI

---

## 6. DASHBOARD MODULE

---

### 6.1 Dashboard API

#### Endpoint

```
GET /dashboard/summary
```

#### Query Params

| Param     | Optional | Description                |
| --------- | -------- | -------------------------- |
| projectId | Yes      | Project-specific dashboard |

#### Behavior

1. Fetches **latest MIS snapshot**
2. Filters KPIs based on user role
3. Returns only allowed metrics

#### Response Example

```json
{
  "date": "2026-01-09",
  "projectId": 1,
  "metrics": {
    "cashBalance": 450000,
    "stockValue": 1200000
  }
}
```

📌 No calculations
📌 No joins
📌 Extremely fast

---

## 7. MIS SNAPSHOT SYSTEM (CORE OF THIS MODULE)

---

## 7.1 MIS Snapshot (Master Table)

### Table: `mis_snapshots`

Stores **daily project-level KPIs**

| Category  | Fields                                  |
| --------- | --------------------------------------- |
| Finance   | totalExpense, totalRevenue, cashBalance |
| Inventory | stockIn, stockOut, stockValue           |
| Contracts | raBilled, contractorOutstanding         |
| Progress  | dprCount, wprCount                      |

### Constraints

* **Unique** `(date, projectId)`
* Immutable historical data

---

## 7.2 Daily Snapshot Generation

### Service

```js
generateDailySnapshot({ date, projectId })
```

### What it does

1. Deletes existing snapshot for `(date, projectId)`
2. Re-calculates:

   * Finance KPIs (from vouchers)
   * Inventory KPIs (from stock ledger)
   * Contract KPIs (from RA bills)
   * Progress KPIs (from DPR / WPR)
3. Inserts ONE clean snapshot

📌 Safe to re-run
📌 Used by:

* Cron jobs
* Manual reprocessing
* Backfill scripts

---

## 8. BUDGET vs ACTUAL (MIS – FINANCIAL CONTROL)

---

### 8.1 MIS Budget Snapshot

### Table: `mis_budget_snapshots`

| Field        | Meaning          |
| ------------ | ---------------- |
| budgetHeadId | Budget reference |
| budgetAmount | Approved budget  |
| actualAmount | Actual spend     |
| variance     | Budget – Actual  |

---

### 8.2 Budget vs Actual Generation

```js
generateBudgetVsActual({ projectId, date })
```

### Logic

* Joins:

  * Budgets
  * Budget → Account mappings
  * Posted vouchers
* Produces variance per budget head

📌 Used ONLY for reporting
📌 Does NOT affect budgets

---

### 8.3 API

```
GET /mis/budget-vs-actual?projectId=1
```

---

## 9. PROCUREMENT MIS – QUOTATION COMPARISON

---

### 9.1 MIS Procurement Snapshot

### Table: `mis_procurement_snapshots`

Stores **quotation comparison data**

| Field        | Description   |
| ------------ | ------------- |
| rfqId        | RFQ reference |
| materialId   | Material      |
| supplierId   | Supplier      |
| rate         | Quoted rate   |
| isLowest     | Boolean       |
| deviationPct | % above L1    |

---

### 9.2 Generation Logic

```js
generateQuotationComparison({ rfqId })
```

### What it does

1. Reads all quotations for RFQ
2. Groups by material
3. Identifies L1
4. Calculates deviation %

📌 Supports L1 / L2 / L3 comparison
📌 Used by Purchase team & MIS

---

### 9.3 API

```
GET /mis/procurement/compare?rfqId=12
```

---

## 10. MIS CONTROLLER APIs (READ-ONLY)

| Endpoint                   | Purpose           |
| -------------------------- | ----------------- |
| `/mis/dashboard`           | Role-based KPI    |
| `/mis/budget-vs-actual`    | Financial control |
| `/mis/procurement/compare` | RFQ comparison    |

📌 No POST / PUT / DELETE
📌 MIS is **read-only by design**

---

## 11. SECURITY & GOVERNANCE

| Layer       | Rule                    |
| ----------- | ----------------------- |
| Auth        | All routes protected    |
| Role        | KPI visibility enforced |
| Data        | Snapshots immutable     |
| Performance | No live joins           |

---

## 12. WHAT THIS MODULE DOES **NOT** DO

❌ No approvals
❌ No business rules
❌ No workflow
❌ No direct posting
❌ No transactional writes

---

## 13. FINAL STATUS

### ✅ DASHBOARD & MIS = **101% COMPLETE**

✔ Snapshot-driven
✔ Role-filtered
✔ High-performance
✔ Audit-safe
✔ Enterprise-ready

🔒 **LOCK THIS MODULE**

---

## 14. SYSTEM POSITION (BIG PICTURE)

With this module complete:

* All core ERP data is now **observable**
* Management gets **trustworthy numbers**
* UI teams can work independently
* No reporting tech debt remains
