# Data Model: Goals UI

**Phase**: 1 (Design)  
**Date**: 2026-01-14  
**Purpose**: Define entities, attributes, relationships, and storage schema

## Entity: Goal

### Purpose
Represents a user's objective to accomplish by a deadline. Goals transition between `active` and `completed` states, and can be permanently deleted.

### Attributes

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|-------|
| `id` | UUID string | Yes | Unique, immutable | Generated on creation (crypto.randomUUID()) |
| `title` | string | Yes | 1-500 chars | User-provided goal name |
| `endDate` | ISO 8601 date | Yes | YYYY-MM-DD, future date | User's local midnight deadline |
| `status` | enum | Yes | "active" \| "completed" | Current lifecycle state |
| `createdDate` | ISO 8601 timestamp | Yes | Immutable | Set at creation (new Date().toISOString()) |

### Relationships

- **Belongs to**: User (single user MVP, implicit)
- **Has many**: None
- **Depends on**: None

### Business Logic

#### Days Remaining Calculation
```typescript
// Using date-fns
import { differenceInDays, startOfDay } from 'date-fns';

function calculateDaysRemaining(endDate: string): number {
  const today = startOfDay(new Date());
  const deadline = startOfDay(new Date(endDate));
  return differenceInDays(deadline, today);
}
```

**Behavior**:
- Positive value (e.g., 5): Days until deadline
- Zero (0): Goal due today
- Negative value (e.g., -2): Goal is overdue
- Display logic: Show "Overdue" if < 0, "Due today" if = 0, "X days" if > 0

#### Urgency Highlighting
```typescript
function isUrgent(daysRemaining: number): boolean {
  return daysRemaining <= 3 && daysRemaining >= 0;
}
```

**Styling**: Highlight with pastel-peach color when urgent (≤3 days, not overdue)

#### Status Transitions

```
[Creation]
    ↓
  active
    ├→ (checkbox + "Mark Complete") → completed
    └→ (checkbox + "Delete") → [removed]

[Completed]
    ├→ (delete button) → [removed]
    └→ (stays in completed column)
```

---

## Entity: User

### Purpose
Represents a single user (MVP scope: no authentication, implicit single user).

### Attributes

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|-------|
| `id` | string | Yes | Fixed value: "default-user" | Single user MVP |
| `preferences` | object | No | {} | Reserved for future (theme, notifications) |

### Relationships

- **Has many**: Goals

---

## Storage Schema (localStorage)

### Key: `doit-goals-v1`

```json
{
  "goals": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Learn Next.js App Router",
      "endDate": "2026-02-14",
      "status": "active",
      "createdDate": "2026-01-14T09:30:00Z"
    },
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "title": "Deploy doit to production",
      "endDate": "2026-03-01",
      "status": "active",
      "createdDate": "2026-01-10T14:15:00Z"
    },
    {
      "id": "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
      "title": "Finish project documentation",
      "endDate": "2026-01-20",
      "status": "completed",
      "createdDate": "2025-12-15T10:00:00Z"
    }
  ]
}
```

### Storage Operations

#### Read (Load Goals)
```typescript
function loadGoals(): Goal[] {
  try {
    const data = localStorage.getItem('doit-goals-v1');
    return data ? JSON.parse(data).goals : [];
  } catch (error) {
    console.error('Failed to load goals:', error);
    return [];
  }
}
```

#### Write (Save Goals)
```typescript
function saveGoals(goals: Goal[]): void {
  try {
    localStorage.setItem('doit-goals-v1', JSON.stringify({ goals }));
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      // Trigger FR-007: Disable Add Goal button
      throw new Error('Storage quota exceeded');
    }
    throw error;
  }
}
```

#### Create Goal
```typescript
function createGoal(title: string, endDate: string): Goal {
  return {
    id: crypto.randomUUID(),
    title,
    endDate,
    status: 'active',
    createdDate: new Date().toISOString()
  };
}
```

#### Update Goal Status
```typescript
function updateGoalStatus(goalId: string, newStatus: 'active' | 'completed'): void {
  const goals = loadGoals();
  const goal = goals.find(g => g.id === goalId);
  if (goal) {
    goal.status = newStatus;
    saveGoals(goals);
  }
}
```

#### Delete Goal
```typescript
function deleteGoal(goalId: string): void {
  const goals = loadGoals();
  const filtered = goals.filter(g => g.id !== goalId);
  saveGoals(filtered);
}
```

---

## Computed Properties (Read-Only)

### Active Goals
```typescript
const activeGoals = goals.filter(g => g.status === 'active');
```

### Completed Goals
```typescript
const completedGoals = goals.filter(g => g.status === 'completed');
```

### Goals by Urgency (Active Only)
```typescript
const urgentGoals = activeGoals.filter(g => calculateDaysRemaining(g.endDate) <= 3);
```

### Sorted for Display (Active)
```typescript
const sortedActive = activeGoals.sort((a, b) => {
  const daysA = calculateDaysRemaining(a.endDate);
  const daysB = calculateDaysRemaining(b.endDate);
  return daysA - daysB; // Closest deadline first
});
```

---

## Validation Rules

### Goal Title
- Required: Must not be empty
- Length: 1-500 characters
- Characters: Any Unicode (no restrictions)
- Trimmed: Whitespace trimmed on save

### End Date
- Required: Must not be empty
- Format: ISO 8601 date (YYYY-MM-DD)
- Constraint: Must be a valid date
- Constraint: Must be in the future (not today or past)
- Timezone: User's local timezone (browser timezone)

### Goal Status
- Enum: "active" | "completed"
- Default on creation: "active"
- Transitions: active ↔ completed, or deleted (removed from array)

---

## Transactions & Consistency

### Atomicity
- Single goal operations (create, update, delete) are atomic (single localStorage write)
- Rollback: Not implemented in MVP (localStorage assumes write success)

### Consistency
- Goals array is in-memory during session
- Persisted to localStorage on every write
- Load on app initialization recovers last saved state

### Conflict Resolution
- Single-user MVP: No conflicts
- Multi-user (future): Would require server-side conflict resolution

---

## Migration Strategy (Future)

### v1 → v2 (if backend added)
```typescript
// When backend is ready, export all localStorage goals
const goals = loadGoals();
// POST to /api/goals/import
await fetch('/api/goals/import', {
  method: 'POST',
  body: JSON.stringify({ goals })
});
// Clear localStorage after successful sync
localStorage.removeItem('doit-goals-v1');
```

---

## Summary

- **Goal**: Objective with deadline, status, and lifecycle
- **User**: Single user (MVP), implicit
- **Storage**: localStorage with key `doit-goals-v1`
- **Persistence**: All CRUD operations write immediately to localStorage
- **Validation**: Title, endDate, status rules enforced
- **Computed Fields**: Days remaining (date-fns), urgency, sorting
- **No Relationships**: Simple flat array (no joins, no foreign keys)
- **Future-proof**: Schema allows easy migration to backend later
