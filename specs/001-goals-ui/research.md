# Research: Goals UI Implementation

**Phase**: 0 (Research & Validation)  
**Date**: 2026-01-14  
**Purpose**: Validate technology choices and document best practices

## Technology Decisions

### 1. Date Calculation in Browser (Local Timezone)

**Decision**: Use `date-fns` with browser's local timezone for countdown calculations

**Rationale**:
- `date-fns` is lightweight, tree-shakeable, and widely used for React date handling
- Browser timezone is intuitive for users (no timezone picker needed in MVP)
- `differenceInDays()` provides accurate day counting with proper edge case handling
- No external API calls needed for date math

**Implementation Pattern**:
```typescript
import { differenceInDays, startOfDay } from 'date-fns';

const daysRemaining = differenceInDays(
  startOfDay(new Date(goal.endDate)),
  startOfDay(new Date())
);
```

**Alternatives Considered**:
- Moment.js: Rejected (larger bundle, slower performance, library deprecated)
- Native Date API: Rejected (timezone handling complex, error-prone day math)

---

### 2. Component Library: shadcn/ui

**Decision**: Use shadcn/ui for all UI components

**Rationale**:
- Built on Radix UI (unstyled, accessible primitives) + Tailwind CSS
- Fully customizable (copy-paste components, own your code)
- Zero runtime dependencies (components are source code, not npm packages)
- Perfect alignment with Tailwind @theme for pastel colors
- Excellent accessibility (WCAG compliant)

**Component Usage**:
- `Button` - Add Goal button
- `Dialog` - Modal form container
- `Input` - Title and date inputs
- `Select` or custom dropdown - Goal action menu
- `Card` - Goal card container

**Alternatives Considered**:
- Chakra UI: Rejected (large runtime dependency, overkill for MVP)
- Headless UI: Rejected (less component coverage, more manual styling)

---

### 3. Pastel Color Theme with Tailwind @theme

**Decision**: Define pastel colors in `tailwind.config.js` using @theme

**Rationale**:
- @theme allows CSS variable-based theming (lightweight, runtime changeable)
- Pastel colors (low saturation, high lightness) are user-friendly and modern
- Tailwind's extend pattern keeps defaults while adding custom colors

**Pastel Palette**:
```javascript
colors: {
  'pastel-pink': '#FFB3D9',
  'pastel-mint': '#B3E5D9',
  'pastel-lavender': '#D9B3FF',
  'pastel-peach': '#FFD9B3',
  'pastel-sky': '#B3D9FF',
  'urgency-highlight': '#FFE0B3', // Warmer for 3-day warning
}
```

**Alternatives Considered**:
- CSS-in-JS (styled-components): Rejected (conflicts with Tailwind, adds runtime)
- CSS Modules: Rejected (verbose, loses Tailwind's utility benefits)

---

### 4. localStorage for Goal Persistence

**Decision**: Use browser localStorage for MVP goal storage

**Rationale**:
- No backend needed for MVP (single user, client-side only)
- Built-in to all modern browsers (no npm dependency)
- Synchronous reads/writes (simple state management)
- ~5-10MB quota sufficient for hundreds of goals
- Data persists across page refreshes (user expectation met)

**Storage Schema**:
```json
{
  "goals": [
    {
      "id": "uuid-1",
      "title": "Learn TypeScript",
      "endDate": "2026-02-14",
      "status": "active",
      "createdDate": "2026-01-14T10:00:00Z"
    }
  ]
}
```

**Error Handling**:
- localStorage disabled: "Add Goal" button disabled, error message shown (FR-007)
- Quota exceeded: Same as above (graceful degradation)
- Corrupted data: Parse errors caught, localStorage reset to empty

**Alternatives Considered**:
- IndexedDB: Rejected (async, complex API, overkill for MVP)
- Backend API: Rejected (out of scope for initial page setup)

---

### 5. Custom React Hooks for State Management

**Decision**: Use custom hooks (useGoals, useGoalActions) instead of Context or Redux

**Rationale**:
- Simple feature scope doesn't require complex state management
- Hooks integrate localStorage read/write seamlessly
- Testable logic without test infrastructure (can be validated manually)
- Easy to refactor to Context/Redux later if scope expands

**Hook Signatures**:
```typescript
// Read goals from localStorage
const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  // Load from localStorage on mount
  // Return [active, completed] arrays
}

// Actions: complete, delete, add goal
const useGoalActions = (goals, setGoals) => {
  return {
    completeGoal: (id) => { /* move to completed */ },
    deleteGoal: (id) => { /* remove permanently */ },
    addGoal: (title, endDate) => { /* create new */ }
  }
}
```

---

### 6. TypeScript Strict Mode Enforcement

**Decision**: Enable `strict: true` in tsconfig.json (constitution requirement)

**Rationale**:
- Catches type errors at compile time, prevents runtime bugs
- Required by constitution for clean code principle
- No performance impact (compile-time only)
- Modern best practice

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

### 7. ESLint 9 for Code Quality

**Decision**: Use ESLint 9 with next/recommended config

**Rationale**:
- Enforces consistent code style (constitution clean code principle)
- Catches common bugs (unused vars, missing dependencies)
- Next.js has first-class ESLint support
- GitHub Copilot integrates with ESLint for real-time feedback

**Config**: `.eslintrc.json` or `eslint.config.mjs` (v9 flat config)

---

## No Testing Infrastructure (Constitution Compliance)

**Decision**: Zero test files, zero test frameworks

**Rationale**:
- Constitution principle V: "No Testing (NON-NEGOTIABLE)"
- Manual validation during development is sufficient for MVP
- Spec defines acceptance scenarios for manual verification
- Code can be validated through code review and live testing

**Validation Strategy**:
- Manual browser testing using `npm run dev`
- ESLint catches code quality issues
- TypeScript strict mode catches type errors
- Browser DevTools for performance monitoring

---

## Bundle Size & Performance

**Estimated Final Bundle**:
- Next.js: ~70KB (gzipped)
- React 19: ~42KB (gzipped)
- Tailwind CSS: ~10KB (gzipped, minimal classes)
- date-fns: ~8KB (gzipped, only used functions tree-shaken)
- shadcn/ui components: ~5KB (gzipped, only used components)
- App code: ~15KB (gzipped)
- **Total estimate**: ~150KB gzipped ✅ (target: <3MB)

**Performance Targets** (from spec SC-002):
- Initial load: <1 second on 3G ✅
- Days calculation per goal: <50ms ✅
- DOM updates when goals change: <100ms ✅

---

## Summary: All Decisions Aligned with Constitution

✅ **Technology Stack**:
- Next.js 16.1.1, React 19.2.3, Tailwind 4 (locked versions)
- TypeScript 5, ESLint 9 (code quality)
- date-fns, shadcn/ui (essential dependencies only)
- localStorage (no external API)

✅ **Clean Code**: TypeScript strict mode, ESLint enforcement, functional components, single responsibility

✅ **Simple UX**: Two-column layout, dropdown menus, empty states, clear feedback

✅ **Responsive Design**: Tailwind mobile-first, shadcn's responsive components, pastel colors

✅ **Minimal Dependencies**: Only 2 new npm packages (date-fns, shadcn/ui) vs. many alternatives

✅ **No Testing**: Zero test files, zero test frameworks (constitution non-negotiable)

**Phase 0 Complete**: All research questions answered. Ready for Phase 1 design (data-model, contracts, quickstart).
