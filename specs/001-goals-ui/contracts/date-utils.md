# Contract: Date Formatting & Timezone Utils

**Module**: `app/lib/date-utils.ts`  
**Type**: Utility Functions  
**Purpose**: Encapsulate date-fns operations for days remaining, timezone handling, and formatting

## Function: calculateDaysRemaining(endDate)

### Signature
```typescript
function calculateDaysRemaining(endDate: string): number
```

### Parameters
- `endDate` (string, ISO format YYYY-MM-DD): Goal deadline

### Returns
Number of days remaining (positive, zero, or negative)

### Behavior
```
Calculation: differenceInDays(startOfDay(deadline), startOfDay(today))
Timezone: Uses browser's local timezone (user's computer)
Today: Calculated as startOfDay(new Date())
Deadline: Calculated as startOfDay(new Date(endDate))
```

### Examples
| Goal End Date | Today | Result | Display |
|---------------|-------|--------|---------|
| 2026-01-20 | 2026-01-14 | 6 | "6 days" |
| 2026-01-14 | 2026-01-14 | 0 | "Due today" |
| 2026-01-13 | 2026-01-14 | -1 | "Overdue" |
| 2026-01-17 | 2026-01-14 23:59 | 2 | "2 days" (not 3, because close to midnight) |

### Implementation
```typescript
import { differenceInDays, startOfDay } from 'date-fns';

export function calculateDaysRemaining(endDate: string): number {
  const today = startOfDay(new Date());
  const deadline = startOfDay(new Date(endDate));
  return differenceInDays(deadline, today);
}
```

---

## Function: formatDaysDisplay(days)

### Signature
```typescript
function formatDaysDisplay(days: number): string
```

### Parameters
- `days` (number): Result from calculateDaysRemaining()

### Returns
User-friendly display string

### Behavior
```
If days > 0:  "X days remaining"
If days = 0:  "Due today"
If days < 0:  "Overdue"
```

### Examples
```typescript
formatDaysDisplay(5) → "5 days remaining"
formatDaysDisplay(0) → "Due today"
formatDaysDisplay(-2) → "Overdue"
```

### Implementation
```typescript
export function formatDaysDisplay(days: number): string {
  if (days > 0) return `${days} days remaining`;
  if (days === 0) return 'Due today';
  return 'Overdue';
}
```

---

## Function: isUrgent(days)

### Signature
```typescript
function isUrgent(days: number): boolean
```

### Parameters
- `days` (number): Result from calculateDaysRemaining()

### Returns
Boolean indicating if goal should be highlighted

### Behavior
```
Urgent if: 0 <= days <= 3 (today through 3 days out)
Not urgent if: days < 0 (overdue, already highlighted differently)
Not urgent if: days > 3 (plenty of time)
```

### Examples
```typescript
isUrgent(0) → true  // Due today
isUrgent(2) → true  // Within 3 days
isUrgent(3) → true  // Exactly 3 days
isUrgent(4) → false // More than 3 days
isUrgent(-1) → false // Overdue (separate styling)
```

### Implementation
```typescript
export function isUrgent(days: number): boolean {
  return days >= 0 && days <= 3;
}
```

---

## Function: formatDateForDisplay(dateString)

### Signature
```typescript
function formatDateForDisplay(dateString: string): string
```

### Parameters
- `dateString` (string, ISO format YYYY-MM-DD): Date to format

### Returns
Human-readable date string with browser locale

### Behavior
- Format: "Mon, Jan 14, 2026" (locale-aware)
- Uses browser's locale (document.documentElement.lang or en-US default)

### Examples
```typescript
formatDateForDisplay('2026-01-20') → "Tue, Jan 20, 2026" (en-US)
formatDateForDisplay('2026-01-20') → "mar., 20 janv. 2026" (fr-FR)
```

### Implementation
```typescript
import { format, parseISO } from 'date-fns';

export function formatDateForDisplay(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'EEE, MMM d, yyyy');
}
```

---

## Function: formatDateForInput(dateString)

### Signature
```typescript
function formatDateForInput(dateString: string): string
```

### Parameters
- `dateString` (string, ISO format YYYY-MM-DD): Date to format

### Returns
ISO format string suitable for `<input type="date">`

### Behavior
- Format: "YYYY-MM-DD" (HTML date input standard)
- No timezone conversion (use endDate as-is)

### Examples
```typescript
formatDateForInput('2026-01-20') → "2026-01-20"
```

### Implementation
```typescript
export function formatDateForInput(dateString: string): string {
  return dateString; // Already in correct format
}
```

---

## Function: validateEndDate(dateString)

### Signature
```typescript
function validateEndDate(dateString: string): { valid: boolean; error?: string }
```

### Parameters
- `dateString` (string, from form input): End date to validate

### Returns
Object with `valid` boolean and optional `error` message

### Validation Rules
1. Required: Not empty
2. Format: Valid ISO 8601 (YYYY-MM-DD)
3. Future: Must not be in the past or today
4. Reasonable: Not more than 10 years in future (optional UX constraint)

### Examples
```typescript
validateEndDate('2026-02-01') 
  → { valid: true }

validateEndDate('')
  → { valid: false, error: 'End date is required' }

validateEndDate('2026-01-14')  // Today
  → { valid: false, error: 'End date must be in the future' }

validateEndDate('2026-01-13')  // Past
  → { valid: false, error: 'End date must be in the future' }

validateEndDate('not-a-date')
  → { valid: false, error: 'Invalid date format' }
```

### Implementation
```typescript
import { isValid, parseISO, isBefore, startOfDay } from 'date-fns';

export function validateEndDate(
  dateString: string
): { valid: boolean; error?: string } {
  // Check empty
  if (!dateString) {
    return { valid: false, error: 'End date is required' };
  }

  // Check format and validity
  const parsed = parseISO(dateString);
  if (!isValid(parsed)) {
    return { valid: false, error: 'Invalid date format (use YYYY-MM-DD)' };
  }

  // Check not in past/today
  const today = startOfDay(new Date());
  const deadline = startOfDay(parsed);
  if (isBefore(deadline, today) || deadline.getTime() === today.getTime()) {
    return { valid: false, error: 'End date must be in the future' };
  }

  return { valid: true };
}
```

---

## Timezone Assumptions & Limitations

### Assumption
- Browser timezone is user's intended timezone
- No timezone selector (MVP simplicity)
- Days calculated in user's local time

### Example: Edge Case
```
User in PST (UTC-8) at 11pm on Jan 14:
- Goal due Jan 15
- Calculation: startOfDay(Jan 15) - startOfDay(Jan 14) = 1 day
- Display: "1 day remaining" ✓ (intuitive, user expects full day)
```

### Limitation
- No support for different timezones (single user MVP)
- Date inputs use browser's local timezone
- No DST (daylight saving time) handling needed (startOfDay handles it)

---

## Dependencies
- `date-fns`: npm package for all date calculations
- No other date libraries (Moment.js excluded, too heavy)

---

## Summary

Five utility functions provide all date operations:
1. `calculateDaysRemaining()` - Core calculation
2. `formatDaysDisplay()` - User-friendly countdown
3. `isUrgent()` - Urgency highlighting condition
4. `formatDateForDisplay()` - Human-readable dates
5. `validateEndDate()` - Form validation

All functions use `date-fns` for accuracy and timezone handling. Browser timezone assumed (no picker needed for MVP).
