# Module 03 – Purchase & Supplier

**Status:** ✅ Finalized (Backend Locked)
**Scope:** Purchase lifecycle + Supplier Portal
**Design Principle:**

* Backend-first
* No separate document module
* File uploads handled inline using Multer
* Simple, enterprise-safe, conflict-free APIs

---

## 1️⃣ OVERALL BUSINESS FLOW

```
Material Requisition (MR)
        ↓
Request For Quotation (RFQ)  [GLOBAL – visible to all suppliers]
        ↓
Supplier Quotation(s)        [Multiple suppliers allowed]
        ↓
Quotation Approval (L1/L2/L3 logic at UI level)
        ↓
Purchase Order (PO)
        ↓
GRN (Inventory Module)
        ↓
Purchase Bill
        ↓
Accounts Posting
```

---

## 2️⃣ CORE DESIGN DECISIONS (IMPORTANT)

### ✔ Global RFQs

* RFQs are **NOT supplier-specific**
* Every supplier can see **all OPEN RFQs**
* Enables competitive pricing (L1 / L2 / L3)

### ✔ No Document Module

* No separate document service
* Files are uploaded **directly with entities**
* Stored as `attachmentPath` in models

### ✔ Manual + Supplier Quotations

* Supplier Portal → Supplier submits quotation
* Purchase Team → Can manually add quotation (for non-tech suppliers)

---

## 3️⃣ FILE STORAGE STRATEGY

* Uses **local filesystem** (VPS – Hostinger)
* Multer-based upload middleware
* Directory-based segregation

| Entity         | Upload Key      | Example                      |
| -------------- | --------------- | ---------------------------- |
| RFQ            | `rfq`           | `/uploads/rfq/...`           |
| Quotation      | `quotation`     | `/uploads/quotation/...`     |
| Purchase Order | `po`            | `/uploads/po/...`            |
| Purchase Bill  | `purchase-bill` | `/uploads/purchase-bill/...` |

---

## 4️⃣ DATA MODELS SUMMARY

### 🔹 Requisition

```ts
requisition {
  reqNo
  projectId
  budgetId
  estimateId
  requestedBy
  status (DRAFT → SUBMITTED)
}
```

### 🔹 RFQ

```ts
rfq {
  rfqNo
  requisitionId
  attachmentPath
  closingDate
  status (OPEN / CLOSED)
}
```

### 🔹 Quotation

```ts
quotation {
  rfqId
  supplierId
  projectId
  budgetId
  estimateId
  attachmentPath
  validTill
  totalAmount
  status (SUBMITTED / APPROVED / REJECTED)
}
```

### 🔹 Quotation Line

```ts
quotation_line {
  quotationId
  materialId
  qty
  rate
  taxPercent
  totalAmount (auto-calculated)
}
```

### 🔹 Purchase Order (PO)

```ts
purchase_order {
  poNo
  quotationId (unique)
  supplierId
  attachmentPath
  totalAmount
  status (CREATED / APPROVED / CANCELLED)
}
```

### 🔹 Purchase Bill

```ts
purchase_bill {
  billNo
  poId
  grnId (unique)
  attachmentPath
  basicAmount
  taxAmount
  totalAmount
  status (DRAFT / APPROVED / POSTED)
}
```

---

## 5️⃣ PURCHASE MODULE – API CONTRACT

### 📌 Material Requisition

| Method | Endpoint                            | Description |
| ------ | ----------------------------------- | ----------- |
| POST   | `/purchase/requisitions`            | Create MR   |
| PUT    | `/purchase/requisitions/:id/submit` | Submit MR   |
| GET    | `/purchase/requisitions`            | List MRs    |
| GET    | `/purchase/requisitions/:id`        | MR Detail   |

---

### 📌 RFQ

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| POST   | `/purchase/rfqs` | Create RFQ (with file) |
| GET    | `/purchase/rfqs` | List RFQs              |

---

### 📌 Quotation (Purchase Side – Manual)

| Method | Endpoint                           | Description                           |
| ------ | ---------------------------------- | ------------------------------------- |
| POST   | `/purchase/quotations`             | Manual quotation entry (file allowed) |
| PUT    | `/purchase/quotations/:id/approve` | Approve quotation                     |
| GET    | `/purchase/quotations`             | List quotations                       |
| GET    | `/purchase/quotations/:id`         | Quotation detail                      |

---

### 📌 Purchase Order (PO)

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| POST   | `/purchase/po`     | Create PO (file allowed) |
| GET    | `/purchase/po`     | List POs                 |
| GET    | `/purchase/po/:id` | PO detail                |

---

### 📌 Purchase Bill

| Method | Endpoint                   | Description                         |
| ------ | -------------------------- | ----------------------------------- |
| POST   | `/purchase/bills`          | Create Purchase Bill (file allowed) |
| PUT    | `/purchase/bills/:id/post` | Post to Accounts                    |
| GET    | `/purchase/bills`          | List bills                          |
| GET    | `/purchase/bills/:id`      | Bill detail                         |

---

## 6️⃣ SUPPLIER PORTAL – API CONTRACT

### 📌 Supplier RFQs (GLOBAL)

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| GET    | `/supplier/rfqs` | List all OPEN RFQs |

---

### 📌 Supplier Quotation

| Method | Endpoint                   | Description                     |
| ------ | -------------------------- | ------------------------------- |
| POST   | `/supplier/quotations`     | Submit quotation (file allowed) |
| GET    | `/supplier/quotations`     | Supplier quotation history      |
| GET    | `/supplier/quotations/:id` | Quotation detail                |

### ⚠ Rules

* One quotation per RFQ per supplier
* Duplicate submissions blocked
* Supplier **cannot modify after submission**

---

## 7️⃣ ENGINEERING & FINANCIAL SAFETY LOCKS

* ✅ Budget must be APPROVED
* ✅ Estimate must be FINAL
* ✅ RFQ auto-closes after quotation approval
* ✅ One PO per quotation
* ✅ One Bill per GRN
* ✅ Posting to accounts is transactional & locked

---

## 8️⃣ WHAT IS INTENTIONALLY NOT IN BACKEND

Handled by **UI / Workflow layer only**:

* L1 / L2 / L3 ranking
* Supplier comparison UI
* Negotiation logic
* Approval hierarchy screens

Backend is **neutral & deterministic**.
