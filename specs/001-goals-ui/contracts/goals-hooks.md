# Contract: Goals Storage Hook

**Module**: `app/lib/hooks.ts`  
**Type**: React Hook (Custom)  
**Purpose**: Provide reactive access to goals with CRUD operations

## Hook: useGoals()

### Signature
```typescript
const useGoals = (): [activeGoals: Goal[], completedGoals: Goal[]] => {
  // Implementation
}
```

### Returns
Tuple of two arrays:
1. `activeGoals`: Goals with status="active", sorted by days remaining (ascending)
2. `completedGoals`: Goals with status="completed", sorted by creation date (newest first)

### Side Effects
- Runs on mount: Loads goals from localStorage
- Persists to localStorage: Via useGoalActions

### Usage Example
```typescript
const [activeGoals, completedGoals] = useGoals();

return (
  <div className="grid grid-cols-2">
    <GoalColumn title="Active" goals={activeGoals} />
    <GoalColumn title="Completed" goals={completedGoals} />
  </div>
);
```

---

## Hook: useGoalActions()

### Signature
```typescript
const useGoalActions = (
  onMutate?: () => void
): GoalActions => {
  // Implementation
}
```

### Type: GoalActions
```typescript
interface GoalActions {
  addGoal: (title: string, endDate: string) => void;
  completeGoal: (goalId: string) => void;
  deleteGoal: (goalId: string) => void;
}
```

### Method: addGoal(title, endDate)

**Parameters**:
- `title` (string, 1-500 chars): Goal name
- `endDate` (string, YYYY-MM-DD, future date): Goal deadline

**Behavior**:
1. Validate inputs (throw on invalid)
2. Create Goal object with UUID, timestamp
3. Save to localStorage
4. Trigger re-render (state update)
5. Call onMutate() callback if provided

**Error Handling**:
- Invalid title: Throw `Error("Title required")`
- Invalid date format: Throw `Error("Invalid date format")`
- Past date: Throw `Error("End date must be in the future")`
- localStorage quota: Throw `Error("Storage quota exceeded")` → UI disables button

**Idempotency**: Not idempotent (each call creates new UUID)

---

### Method: completeGoal(goalId)

**Parameters**:
- `goalId` (string, UUID): Goal to mark complete

**Behavior**:
1. Find goal by ID
2. Set status="completed"
3. Save to localStorage
4. Trigger re-render
5. Call onMutate()

**Error Handling**:
- Goal not found: Silently ignore (no-op)

---

### Method: deleteGoal(goalId)

**Parameters**:
- `goalId` (string, UUID): Goal to delete permanently

**Behavior**:
1. Remove goal from array
2. Save to localStorage
3. Trigger re-render
4. Call onMutate()

**Error Handling**:
- Goal not found: Silently ignore (no-op)
- No undo: User cannot recover deleted goal

---

## Usage Pattern

```typescript
export function GoalsContainer() {
  const [activeGoals, completedGoals] = useGoals();
  const actions = useGoalActions();

  const handleAddGoal = (title: string, endDate: string) => {
    try {
      actions.addGoal(title, endDate);
    } catch (error) {
      // Show error toast/message
    }
  };

  const handleComplete = (goalId: string) => {
    actions.completeGoal(goalId);
  };

  const handleDelete = (goalId: string) => {
    actions.deleteGoal(goalId);
  };

  return (
    <div>
      <GoalColumn
        goals={activeGoals}
        onComplete={handleComplete}
        onDelete={handleDelete}
      />
      <GoalColumn goals={completedGoals} onDelete={handleDelete} />
    </div>
  );
}
```

---

## Implementation Details

### Storage Persistence
- Both hooks read/write from `localStorage.getItem('doit-goals-v1')`
- Each mutation (add, complete, delete) saves entire goals array
- Optimistic updates: Update local state before storage (assume success)

### Error Recovery
- Storage disabled: addGoal throws, button disabled (FR-007)
- Storage quota exceeded: Same as above
- Corrupted data on load: Return empty array, continue

### Performance Considerations
- Goals array fits entirely in memory (<1MB typical)
- localStorage read: Synchronous, <10ms typical
- Sorting: O(n log n), acceptable for <1000 goals
- Re-render: Only triggered on mutations, not on access

---

## Testing (Manual Validation Only)

**No automated tests per constitution.**

Manual validation scenarios:
1. Add goal with valid title and future date → Goal appears in active column
2. Complete goal → Moves to completed column
3. Delete goal → Removed from all columns
4. Reload page → Goals persist (load from localStorage)
5. Invalid date (past) → Form rejects submission
6. Empty localStorage → Empty state shows

---

## Summary

Two complementary hooks provide all goal CRUD operations:
- `useGoals()`: Read-only reactive access to active/completed goals
- `useGoalActions()`: Mutation methods (add, complete, delete)

Both integrate with localStorage transparently. No state management library (Redux/Context) needed for MVP scope.
