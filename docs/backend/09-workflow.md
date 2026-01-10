# 📘 Module 09 – Workflow

**Status: 101% COMPLETE & LOCKED**

---

## 1. PURPOSE & DESIGN PHILOSOPHY

The Workflow module provides a **generic, reusable approval engine** for the entire ERP system.

It ensures that:

* No critical business record is **used, posted, or executed** without approval
* Approval logic is **configuration-driven**, not hardcoded
* Approval steps are **role-based**, auditable, and SLA-aware
* All modules (Purchase, Contracts, Accounts, Engineering, etc.) use **one single approval system**

> 🔒 **Golden Rule**
> Any module that requires approval **MUST call Workflow**
> Any module that posts/executes **MUST validate approval**

---

## 2. CORE CONCEPTS

### 2.1 Workflow vs Instance (Very Important)

| Concept               | Meaning                                |
| --------------------- | -------------------------------------- |
| **Workflow**          | Approval definition (template)         |
| **Workflow Step**     | One approval level                     |
| **Workflow Instance** | Runtime approval for a specific record |
| **Workflow Action**   | User action (approve/reject)           |

---

## 3. DATABASE MODELS

---

### 3.1 `workflow`

Defines approval configuration for a module entity.

```js
workflow
```

| Field    | Type    | Description                         |
| -------- | ------- | ----------------------------------- |
| module   | STRING  | PURCHASE, CONTRACTS, ACCOUNTS, etc. |
| entity   | STRING  | PO, RFQ, RA_BILL, VOUCHER, etc.     |
| isActive | BOOLEAN | Enable / disable workflow           |

📌 **Behavior**

* If no active workflow exists → record auto-approved
* Workflow can be changed without touching business logic

---

### 3.2 `workflow_step`

Defines approval levels.

```js
workflow_step
```

| Field      | Type | Description             |
| ---------- | ---- | ----------------------- |
| workflowId | FK   | Parent workflow         |
| stepOrder  | INT  | Sequence (1, 2, 3…)     |
| roleId     | INT  | Role allowed to approve |
| slaHours   | INT  | SLA for this step       |

📌 **Rules**

* Steps execute strictly in order
* Role enforcement is mandatory
* SLA is optional but supported

---

### 3.3 `workflow_instance`

Runtime approval record.

```js
workflow_instance
```

| Field       | Type | Description                   |
| ----------- | ---- | ----------------------------- |
| workflowId  | FK   | Workflow definition           |
| recordId    | INT  | Business record ID            |
| currentStep | INT  | Current approval step         |
| status      | ENUM | PENDING / APPROVED / REJECTED |

📌 **Critical Guarantees**

* Only **ONE active instance per record**
* Auto-created when workflow starts
* Used by all modules to validate approval

---

### 3.4 `workflow_action`

Audit trail of approvals.

```js
workflow_action
```

| Field      | Type | Description       |
| ---------- | ---- | ----------------- |
| instanceId | FK   | Workflow instance |
| stepOrder  | INT  | Step acted on     |
| userId     | INT  | Acting user       |
| action     | ENUM | APPROVE / REJECT  |
| remarks    | TEXT | Optional comment  |

📌 **Never deleted**
This is a legal & audit record.

---

## 4. WORKFLOW ENGINE BEHAVIOR

---

### 4.1 Starting a Workflow

```js
workflowService.start({ module, entity, recordId })
```

#### Logic:

1. Check if active workflow exists
2. If none → auto-approve
3. If steps exist → create instance (PENDING)
4. If already pending → reuse instance

📌 Used in:

* Purchase (RFQ, PO)
* Contracts (WO, RA Bill)
* Accounts (Voucher)
* Any future module

---

### 4.2 Acting on a Workflow

```js
workflowService.act({ instanceId, userId, action, remarks })
```

#### Validations:

* Instance must be `PENDING`
* User must match step `roleId`
* Duplicate actions are blocked
* Reject ends workflow immediately

#### Outcomes:

| Action              | Result              |
| ------------------- | ------------------- |
| APPROVE (last step) | Instance → APPROVED |
| APPROVE (middle)    | Move to next step   |
| REJECT              | Instance → REJECTED |

---

### 4.3 Approval Enforcement (Critical)

```js
ensureApproved(module, entity, recordId)
```

📌 Used before:

* Posting vouchers
* Executing RA Bills
* Creating PO from quotation
* Any irreversible action

❌ Throws error if:

* No workflow instance
* Status ≠ APPROVED

---

## 5. SLA MANAGEMENT

### 5.1 SLA Checker

```js
sla.checker.js
```

* Periodically scans pending instances
* Compares `createdAt + slaHours`
* Triggers escalation hooks (email / notification)

📌 SLA is **soft-enforced**
(no auto-approve, only alerts)

---

## 6. API ENDPOINTS

---

### 6.1 Take Action

```
POST /workflow/action
```

```json
{
  "instanceId": 12,
  "action": "APPROVE",
  "remarks": "Verified"
}
```

---

### 6.2 My Pending Approvals

```
GET /workflow/my-pending
```

Returns all pending workflow instances.

Used by:

* Dashboard
* Approval inbox UI

---

### 6.3 Workflow Instance Details

```
GET /workflow/instance/:id
```

Returns:

* Workflow
* Current step
* Full approval history

---

## 7. INTEGRATION RULES (MANDATORY)

### 7.1 Modules That MUST Use Workflow

| Module      | Entity                       |
| ----------- | ---------------------------- |
| Purchase    | RFQ, PO                      |
| Contracts   | Work Order, RA Bill, DC Note |
| Accounts    | Voucher                      |
| Engineering | (Optional approvals)         |

---

### 7.2 Enforcement Pattern

```js
await ensureApproved('ACCOUNTS', 'VOUCHER', voucherId);
```

❌ Never bypass
❌ Never duplicate logic
❌ Never hardcode approvals

---

## 8. FAILURE & EDGE CASE HANDLING

| Scenario                      | Behavior                    |
| ----------------------------- | --------------------------- |
| No workflow configured        | Auto-approve                |
| No steps defined              | Auto-approve                |
| Workflow disabled mid-process | Existing instances continue |
| User tries wrong role         | Hard error                  |
| Duplicate approval attempt    | Hard error                  |

---

## 9. SECURITY & AUDIT GUARANTEES

✔ Role-based access
✔ Immutable approval history
✔ Single source of truth
✔ No module-specific approval hacks
✔ Enterprise-grade traceability

---

## 10. FINAL STATUS

### ✅ WORKFLOW MODULE = **101% COMPLETE**

* Backend: ✔️
* Approval logic: ✔️
* SLA: ✔️
* Audit: ✔️
* UI-ready APIs: ✔️
* Future-proof: ✔️

🔒 **This module should now be treated as LOCKED.**