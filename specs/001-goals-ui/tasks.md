---
description: "Implementation tasks for doit goal tracking app - initial page setup"
---

# Tasks: Initial Page Setup - Doit Goal Tracking App

**Input**: Design documents from `specs/001-goals-ui/`  
**Prerequisites**: spec.md ✅, plan.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: NO TESTS are permitted in this project. See Constitution: No Testing (NON-NEGOTIABLE).

**Organization**: Tasks are grouped by user story to enable independent implementation and delivery of each story as an MVP increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **App code**: `app/` directory (Next.js App Router)
- **Components**: `app/components/` for React components
- **Utilities**: `app/lib/` for utilities, hooks, types
- **Styles**: `app/styles/` for global CSS

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure. Must be completed first.

- [ ] T001 Install npm dependencies: Next.js 16.1.1, React 19.2.3, Tailwind 4, date-fns, shadcn/ui
- [ ] T002 [P] Setup TypeScript strict mode in `tsconfig.json` (noImplicitAny, noUnusedLocals, noUnusedParameters)
- [ ] T003 [P] Configure ESLint 9 in `eslint.config.mjs` with next/recommended config
- [ ] T004 [P] Configure Tailwind CSS 4 in `tailwind.config.js` with pastel color palette (@theme)
- [ ] T005 [P] Setup shadcn/ui component library: run `npx shadcn-ui@latest init`
- [ ] T006 [P] Create project directory structure: `app/components/`, `app/lib/`, `app/styles/`

**Checkpoint**: Development environment ready. Next.js app starts with `npm run dev`. ESLint and TypeScript compile without errors.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and types that all user stories depend on. MUST complete before US1-US4.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 [P] Create TypeScript types/interfaces in `app/lib/types.ts`: Goal, User, GoalStatus enums
- [ ] T008 [P] Implement localStorage utils in `app/lib/goals-storage.ts`: loadGoals(), saveGoals(), validateStorage()
- [ ] T009 [P] Implement date utils in `app/lib/date-utils.ts`: calculateDaysRemaining(), formatDaysDisplay(), isUrgent(), validateEndDate()
- [ ] T010 Create root layout component in `app/layout.tsx`: Tailwind globals, theme provider, viewport config
- [ ] T011 Create home page in `app/page.tsx`: Basic structure, imports GoalsContainer

**Checkpoint**: Foundation complete. Storage and date logic are tested and working. Root layout renders without errors. Ready for user story implementation.

---

## Phase 3: User Story 1 - View Active and Completed Goals (Priority: P1) 🎯 MVP

**Goal**: Display all goals in a responsive two-column layout (active left, completed right) with countdown timers showing days remaining. This is the core feature—user can see their goals and progress at a glance.

**Independent Validation**: Open app, manually add goals via console, verify two-column layout displays with correct days remaining for each active goal, verify completed goals appear in right column, verify layout is responsive at 320px/768px/1920px.

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create custom hooks in `app/lib/hooks.ts`: useGoals() hook returning [activeGoals, completedGoals]
- [ ] T013 [P] [US1] Create DaysRemaining component in `app/components/DaysRemaining.tsx`: displays countdown with urgency highlighting
- [ ] T014 [P] [US1] Create EmptyState component in `app/components/EmptyState.tsx`: message for empty columns with encouragement
- [ ] T015 [US1] Create GoalCard component in `app/components/GoalCard.tsx`: displays goal title, checkbox, days remaining (depends on T013, T012)
- [ ] T016 [US1] Create GoalColumn component in `app/components/GoalColumn.tsx`: renders goal array with title, handles layout (depends on T014, T015)
- [ ] T017 [US1] Create GoalsContainer component in `app/components/GoalsContainer.tsx`: two-column layout manager, integrates useGoals() (depends on T016, T012)
- [ ] T018 [US1] Update `app/page.tsx` to render GoalsContainer component
- [ ] T019 [US1] Test responsive layout at 320px, 768px, 1920px viewports in browser
- [ ] T020 [US1] Verify goal countdown timers update correctly (manual: check DOM via DevTools)
- [ ] T021 [US1] Validate pastel color theme applied correctly (manual: visual inspection of components)

**Checkpoint**: User Story 1 complete. Dashboard displays active goals on left with days remaining, completed goals on right. Responsive and styled. Ready for User Story 2.

---

## Phase 4: User Story 2 - Manage Goals with Checkboxes (Priority: P2)

**Goal**: Enable interactive goal management via checkboxes with dropdown menu. Users can mark goals complete or permanently delete them with immediate visual feedback.

**Independent Validation**: Add goals in US1. Click checkbox on goal → dropdown menu appears. Select "Mark Complete" → goal moves to right column. Click checkbox on another goal → select "Delete" → goal removed. Verify no undo.

### Implementation for User Story 2

- [ ] T022 [P] [US2] Create useGoalActions() hook in `app/lib/hooks.ts`: addGoal(), completeGoal(), deleteGoal() methods with error handling
- [ ] T023 [P] [US2] Create GoalDropdown component in `app/components/GoalDropdown.tsx`: dropdown menu with "Mark Complete" and "Delete" options (uses shadcn Dialog or custom)
- [ ] T024 [US2] Update GoalCard in `app/components/GoalCard.tsx`: add checkbox, wire to onSelect prop, show dropdown on checkbox (depends on T022, T023)
- [ ] T025 [US2] Update GoalColumn in `app/components/GoalColumn.tsx`: wire onComplete and onDelete props, call useGoalActions() methods (depends on T022)
- [ ] T026 [US2] Update GoalsContainer in `app/components/GoalsContainer.tsx`: integrate useGoalActions(), pass handlers to GoalColumn (depends on T022, T025)
- [ ] T027 [US2] Test goal completion flow: click checkbox → dropdown → "Mark Complete" → verify move to completed column
- [ ] T028 [US2] Test goal deletion flow: click checkbox → dropdown → "Delete" → verify goal removed with no undo
- [ ] T029 [US2] Test localStorage persistence: complete/delete goals, reload page, verify state persisted

**Checkpoint**: User Story 2 complete. Goals can be marked complete (move to right column) or deleted (permanently removed). All actions persist to localStorage.

---

## Phase 5: User Story 3 - Highlight Urgent Goals (Priority: P2)

**Goal**: Visually distinguish goals approaching deadline (≤3 days remaining) to help users prioritize. Urgent goals stand out without alarm.

**Independent Validation**: Create goal with end date 3 days from today → verify highlighted with urgency color (pastel-peach). Create goal 4 days from today → verify NOT highlighted (normal styling). Verify highlighting updates correctly as days count down (manual date check via DevTools).

### Implementation for User Story 3

- [ ] T030 [P] [US3] Update isUrgent() in `app/lib/date-utils.ts`: verify logic for 0 ≤ days ≤ 3
- [ ] T031 [P] [US3] Update DaysRemaining in `app/components/DaysRemaining.tsx`: apply urgency color (pastel-peach from @theme) when isUrgent() true
- [ ] T032 [US3] Update GoalCard in `app/components/GoalCard.tsx`: apply conditional border/background styling when days ≤ 3 (depends on T031)
- [ ] T033 [US3] Update Tailwind config with urgency color mapping if not already in T004
- [ ] T034 [US3] Test urgency highlighting: create goals with various remaining days, verify correct highlighting
- [ ] T035 [US3] Verify highlighting updates as time passes (manual: adjust browser time or check calculation logic)

**Checkpoint**: User Story 3 complete. Goals with ≤3 days remaining are highlighted with urgency color. Styling is consistent and visually distinct.

---

## Phase 6: User Story 4 - Add New Goals via Modal Form (Priority: P3)

**Goal**: Enable users to create new goals through a modal form with title and end date inputs. Complete the core feature set.

**Independent Validation**: Click "Add Goal" button → modal opens with title and date fields. Fill with title and valid future date → click Submit → modal closes, goal appears in active column with correct countdown. Click Cancel → modal closes without creating goal. Try invalid date (past) → form prevents submission with error message.

### Implementation for User Story 4

- [ ] T036 [P] [US4] Create AddGoalModal component in `app/components/AddGoalModal.tsx`: form with title input, date input, Submit/Cancel buttons (uses shadcn Dialog)
- [ ] T037 [P] [US4] Create AddGoalButton component in `app/components/AddGoalButton.tsx`: button that toggles modal visibility
- [ ] T038 [US4] Update GoalsContainer in `app/components/GoalsContainer.tsx`: render AddGoalButton and AddGoalModal, wire onSubmit to useGoalActions().addGoal() (depends on T036, T037, T022)
- [ ] T039 [US4] Add form validation in AddGoalModal: title required (1-500 chars), date required and must be future date (uses validateEndDate() from T009)
- [ ] T040 [US4] Add error message display in AddGoalModal: show validation errors inline with clear messaging
- [ ] T041 [US4] Test modal open/close: click Add Goal → modal opens, click Cancel → closes without creating
- [ ] T042 [US4] Test goal creation: fill form with valid title and future date → click Submit → goal appears in active column
- [ ] T043 [US4] Test form validation: try past date → form prevents submission with error, try empty title → form prevents submission with error
- [ ] T044 [US4] Test localStorage error handling: simulate quota exceeded → "Add Goal" button disabled with error message (FR-007)

**Checkpoint**: User Story 4 complete. Users can create goals via modal form. Form validates title and end date. Goals immediately appear in active column. Feature set is MVP complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality improvements affecting multiple stories. Final validation before merge.

- [ ] T045 [P] Test empty states: no active goals → left column shows empty state message, no completed goals → right column shows empty state message
- [ ] T046 [P] Test overdue handling: create goal with past end date (via localStorage manually) → displays "Overdue" with special highlight
- [ ] T047 [P] Test long goal titles: create goal with 100+ char title → verify truncation on mobile, full title visible on hover
- [ ] T048 [P] Test responsive design at all breakpoints: 320px (mobile), 768px (tablet), 1920px (desktop) → no layout breaks, all features functional
- [ ] T049 [P] Run TypeScript compiler: `npx tsc --noEmit` → zero errors (strict mode)
- [ ] T050 [P] Run ESLint: `npm run lint` → zero errors/warnings
- [ ] T051 Create README with setup instructions and manual validation scenarios
- [ ] T052 Verify all goals persist across page reload: add goals, reload page, verify all still present
- [ ] T053 Manual smoke test: complete all 4 user story flows in sequence (create, view, manage, complete)
- [ ] T054 Verify bundle size: `npm run build` and check .next/ size is <3MB gzipped
- [ ] T055 Verify page load performance: `npm run dev` and test load time is <1 second on throttled (3G) network

**Checkpoint**: All user stories complete, integrated, styled, and tested. Code passes TypeScript and ESLint. Responsive design validated. Ready for merge.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately ✅
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 can start immediately after Foundational (P1)
  - US2 depends on US1 (checkbox needs rendered cards)
  - US3 is independent of US1/US2 (only updates styling) but should follow US1 for visual coherence
  - US4 is independent (modal creates goals) but makes sense after US1 (app shows created goals)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: CRITICAL - No dependencies. Blocks US2. Delivers MVP (view goals).
- **US2 (P2)**: Depends on US1 (checkbox needs rendered cards). Adds goal management (complete/delete).
- **US3 (P2)**: Technically independent. Depends on US1 for context (visually enhances active goals). Urgency highlighting.
- **US4 (P3)**: Technically independent. Depends on US1/US2 for demo (users see created goals). Goal creation.

### Within Each User Story

- **US1**:
  1. T012-T014 (P): hooks, DaysRemaining, EmptyState
  2. T015-T016: GoalCard, GoalColumn (depend on T013-T014)
  3. T017-T018: GoalsContainer, page integration (depends on T016)
  4. T019-T021: responsive testing and styling validation

- **US2**:
  1. T022-T023 (P): hooks, GoalDropdown
  2. T024-T026: GoalCard/Column/Container updates (depend on T022-T023)
  3. T027-T029: functional testing

- **US3**:
  1. T030-T033 (P): date logic, component styling
  2. T034-T035: testing

- **US4**:
  1. T036-T037 (P): modal, button components
  2. T038-T040: integration, validation (depend on T036-T037)
  3. T041-T044: testing

### Parallel Opportunities

**All Setup tasks (T001-T006)** can run in parallel:
- Install deps, TypeScript config, ESLint config, Tailwind config, shadcn init, create directories
- Can be done by multiple developers simultaneously, then merged

**Foundational tasks (T007-T011)**:
- T007-T009 (P): types, storage utils, date utils can run in parallel (no dependencies)
- T010-T011: layout/page depend on T007 (imports types)

**Within US1 (T012-T021)**:
- T012-T014 (P) can run in parallel (no dependencies)
- T015-T016 depend on T013-T014, can run once they're ready
- T017-T018 depend on T016
- T019-T021 depend on T018 (full implementation)

**Within US2 (T022-T029)**:
- T022-T023 (P) can run in parallel
- T024-T026 depend on T022-T023
- T027-T029 testing happens after implementation

**Within US3 (T030-T035)**:
- T030-T033 (P) parallel within order constraints
- T034-T035 testing after

**Within US4 (T036-T044)**:
- T036-T037 (P) parallel
- T038-T040 depend on T036-T037
- T041-T044 testing after

**Polish (T045-T055)** (P):
- All can run in parallel after all user stories done

### Parallel Example: User Story 1

```
Team A: Work on T012, T013, T014 in parallel
  (Hooks, DaysRemaining, EmptyState)
  ↓
  [Merge ready]
  ↓
Team B: Work on T015, T016 (depend on T013-T014)
  (GoalCard, GoalColumn)
  ↓
  [Merge ready]
  ↓
Team C: Work on T017, T018 (depend on T016)
  (GoalsContainer, page integration)
  ↓
  [Merge ready]
  ↓
All: Test T019-T021 (responsive, visual validation)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T011)
3. Complete Phase 3: User Story 1 (T012-T021)
4. Run manual validation: Can view active goals with countdown timers?
5. **STOP and VALIDATE**: Deploy if satisfied, or continue to US2

**MVP deliverable**: Dashboard with read-only goal list, two-column layout, countdown timers.

### Incremental Delivery (Recommended)

1. Phases 1-2: Setup & Foundation (T001-T011)
2. Phase 3: US1 View Goals → Deploy (T012-T021)
   - Users can see their goals and deadlines
3. Phase 4: US2 Manage Goals → Deploy (T022-T029)
   - Users can mark complete and delete
4. Phase 5: US3 Urgent Highlighting → Deploy (T030-T035)
   - Users see deadline urgency
5. Phase 6: US4 Add Goals → Deploy (T036-T044)
   - Users can create new goals
6. Phase 7: Polish & Optimize (T045-T055)
   - Code quality, responsive validation, performance tuning

**Each deploy adds value without breaking previous features.**

### Parallel Team Strategy (3+ Developers)

**Week 1:**
- Team A: Phase 1 Setup (T001-T006)
- Team B: Phase 2 Foundational (T007-T011)
- [Merge into main]

**Week 2:**
- Team A: US1 View Goals (T012-T021)
- Team B: US2 Manage (T022-T029) - starts after US1 merged
- Team C: US3 Urgency (T030-T035) - independent, can start in parallel with B

**Week 3:**
- Team A: US4 Add Goals (T036-T044)
- All: Phase 7 Polish & Testing (T045-T055)

**Final:** All features complete, integrated, tested, ready for production.

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label = which user story task belongs to (US1, US2, US3, US4)
- Each task should be **independently completable** by one developer
- Verify tasks **independently** before merging (no test framework, manual validation)
- **NO tests allowed** (constitution requirement) - manual validation sufficient
- Stop at any **Checkpoint** to validate and deploy if needed
- All file paths are exact (enables copy-paste into editor)
- TypeScript, ESLint, responsive design MUST pass before each merge

---

## Success Criteria

✅ All 55 tasks completed  
✅ TypeScript strict mode: `npx tsc --noEmit` zero errors  
✅ ESLint 9: `npm run lint` zero issues  
✅ All 4 user stories manually validated (no automated tests)  
✅ Responsive design tested at 320px, 768px, 1920px  
✅ localStorage persistence: goals survive page reload  
✅ Bundle size: <3MB gzipped  
✅ Page load: <1 second on 3G network  
✅ Ready for production deployment ✅
