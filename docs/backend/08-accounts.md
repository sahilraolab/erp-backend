# 📘 Module 08 – Accounts

**(Financial Accounting & Reporting Engine)**

---

## 1️⃣ PURPOSE & SCOPE

The **Accounts module** is the **financial backbone** of the ERP.
It is responsible for:

* Chart of Accounts (COA)
* Voucher creation & posting
* Double-entry bookkeeping
* Integration with Engineering (Budget & Compliance)
* Automated postings (RA Bills, DC Notes, Interest, Depreciation)
* Financial reports (Trial Balance, P&L, Balance Sheet, Cash Flow)
* Audit & workflow enforcement

⚠️ **All financial postings across the system MUST pass through this module.**

---

## 2️⃣ DESIGN PRINCIPLES (NON-NEGOTIABLE)

### 🔒 Single Posting Gate

> **NO module is allowed to write vouchers directly.**

All postings must go through:

```
accounts/posting.service.js
```

This guarantees:

* Atomic transactions
* Budget enforcement
* Compliance enforcement
* Double-entry integrity
* Centralized audit

---

### 🧾 Double-Entry Mandatory

Every posting must create:

* Exactly **1 debit**
* Exactly **1 credit**
* Amounts must match

Unbalanced vouchers are **rejected at API level**.

---

### 🔐 Workflow-Aware

* Vouchers are created → sent for approval
* Only **approved vouchers** can be posted
* Auto-postings bypass manual workflow but still log audits

---

## 3️⃣ DIRECTORY STRUCTURE

```
accounts/
├── account.model.js
├── accountScheduleMap.model.js
├── accounts.associations.js
├── accounts.controller.js
├── accounts.routes.js
├── depreciation.model.js
├── interCompanyAccount.model.js
├── interest.model.js
├── posting.service.js
├── report.controller.js
├── report.routes.js
├── report.service.js
├── voucher.model.js
└── voucherLine.model.js
```

---

## 4️⃣ CORE MODELS

### 4.1 Account (`account.model.js`)

Chart of Accounts (COA).

| Field     | Type    | Notes                                         |
| --------- | ------- | --------------------------------------------- |
| id        | PK      |                                               |
| name      | string  | Account name                                  |
| code      | string  | **Unique**, used for posting                  |
| type      | enum    | ASSET / LIABILITY / INCOME / EXPENSE / EQUITY |
| parentId  | integer | Hierarchical COA                              |
| companyId | integer | Multi-company support                         |
| isActive  | boolean | Soft disable                                  |

---

### 4.2 Voucher (`voucher.model.js`)

Accounting document header.

| Field     | Notes                    |
| --------- | ------------------------ |
| voucherNo | Auto-generated           |
| date      | Posting date             |
| type      | JV / PV / RV             |
| narration | Description              |
| posted    | true only after approval |
| companyId | Mandatory                |

---

### 4.3 Voucher Line (`voucherLine.model.js`)

Debit / Credit entries.

| Field        | Notes    |
| ------------ | -------- |
| voucherId    | FK       |
| accountId    | FK       |
| debit        | Amount   |
| credit       | Amount   |
| contractorId | Optional |
| costCenterId | Optional |

---

## 5️⃣ ASSOCIATIONS

```
Voucher ──< VoucherLine >── Account
```

* One voucher → many lines
* One account → many voucher lines

---

## 6️⃣ CENTRAL POSTING SERVICE (MOST IMPORTANT)

### 📌 File: `posting.service.js`

This is the **ONLY place** where financial entries are written.

### Function: `postVoucher()`

```js
postVoucher({
  type,                    // JV / PV / RV
  narration,
  debitAccountCode,
  creditAccountCode,
  amount,
  userId,
  reference,

  projectId = null,        // For compliance check
  budgetHeadId = null      // For budget enforcement
})
```

### Guarantees:

1. Compliance clearance (Engineering)
2. Budget availability (Engineering)
3. Account locking (race condition safe)
4. Atomic transaction
5. Double-entry creation
6. Audit logging

⚠️ **If a module bypasses this service → it is a bug.**

---

## 7️⃣ ACCOUNTING OPERATIONS

### 7.1 Chart of Accounts

```
POST /accounts
```

Creates an account head.

---

### 7.2 Voucher Creation (Manual)

```
POST /vouchers
```

Rules:

* Debit total must equal credit total
* Voucher starts as **unposted**
* Sent to workflow approval

---

### 7.3 Voucher Posting

```
PUT /vouchers/:id/post
```

Rules:

* Voucher must be approved
* Marks voucher as posted
* Ledger impact happens here

---

## 8️⃣ AUTOMATED POSTINGS

### 8.1 RA Bills (Contracts)

* Posted via `posting.service.js`
* Debit: Construction WIP
* Credit: Contractor Payable

---

### 8.2 Debit / Credit Notes

* Posted via `posting.service.js`
* Type determines debit/credit direction

---

### 8.3 Interest Posting

#### Model: `interest.model.js`

| Field     | Purpose                |
| --------- | ---------------------- |
| accountId | Related account        |
| rate      | Interest amount / rate |
| period    | Monthly / Quarterly    |

#### Action:

```
POST /interest/:id/run
```

Creates:

* Debit → INTEREST_EXPENSE
* Credit → INTEREST_PAYABLE

Uses **central posting service**.

---

### 8.4 Depreciation

#### Model: `depreciation.model.js`

| Field          | Purpose  |
| -------------- | -------- |
| assetAccountId | Asset    |
| rate           | %        |
| method         | SL / WDV |

Posted automatically via JV.

---

## 9️⃣ REPORTING

### 9.1 Trial Balance

```
GET /trial-balance
```

Shows:

* Account-wise debit & credit totals
* Only posted vouchers

---

### 9.2 Profit & Loss

```
GET /reports/pl
```

Includes:

* Income
* Expense
* Net Profit

---

### 9.3 Balance Sheet

```
GET /reports/bs
```

As-on date supported.

---

### 9.4 Cash Flow

```
GET /reports/cash-flow
```

Based on:

* Cash & Bank accounts

---

## 🔟 INTEGRATION POINTS

### Engineering

* Compliance blocking
* Budget control

### Contracts

* RA Bills
* Advances
* DC Notes

### Workflow

* Voucher approval
* Posting permission

---

## 1️⃣1️⃣ SECURITY & PERMISSIONS

| Action         | Permission      |
| -------------- | --------------- |
| Create account | accounts.create |
| Create voucher | accounts.create |
| Post voucher   | accounts.post   |
| View reports   | accounts.report |

---

## 1️⃣2️⃣ WHAT IS **NOT** ALLOWED

❌ Writing voucher lines outside posting service
❌ Skipping compliance check
❌ Skipping budget enforcement
❌ Posting unapproved vouchers
❌ Direct SQL updates to balances
