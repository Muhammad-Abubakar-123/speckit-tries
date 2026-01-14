# Implementation Plan: Initial Page Setup - Doit Goal Tracking App

**Branch**: `001-goals-ui` | **Date**: 2026-01-14 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-goals-ui/spec.md`

## Summary

Build the initial dashboard page of the doit goal tracking app with a two-column layout (active goals left, completed right). Implement goal management via checkboxes with dropdown menus, countdown timer calculations in the user's local timezone, and urgency highlighting for goals within 3 days of deadline. Use Next.js App Router with React hooks, Tailwind CSS @theme for pastel colors, shadcn components for UI consistency, date-fns for date formatting, and localStorage for persistent client-side storage.

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20
**Primary Dependencies**: Next.js 16.1.1, React 19.2.3, React DOM 19.2.3, Tailwind CSS 4, date-fns (for date formatting), shadcn/ui (component library)
**Storage**: localStorage (client-side, MVP scope)
**Target Platform**: Web browser (modern browsers supporting ES2020+)
**Project Type**: Web application (single-page app with Next.js App Router)
**Performance Goals**: Page load <1 second (3G), render countdown updates <100ms, days calculation <50ms per goal
**Constraints**: <3MB bundle size, offline-capable (reads/writes to localStorage), single user (MVP - no auth)
**Scale/Scope**: 100 goals initial UI, responsive across 320px-1920px breakpoints, 4 user stories in Phase 1

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle Alignment ✅

| Principle | Status | Justification |
|-----------|--------|----------------|
| **I. Clean Code** | ✅ Pass | TypeScript 5 strict mode, ESLint 9 enforcement, functional React components with hooks, single responsibility |
| **II. Simple UX** | ✅ Pass | Two-column layout (active/completed), dropdown menus for actions, clear empty states, minimal cognitive load |
| **III. Responsive Design** | ✅ Pass | Tailwind CSS 4 mobile-first, test at 320px/768px/1920px, shadcn components are responsive-by-default |
| **IV. Minimal Dependencies** | ✅ Pass | Only 5 new deps: date-fns (date calcs), shadcn/ui (component library). No test frameworks, no external CSS frameworks |
| **V. No Testing** | ✅ Pass | Zero test files, zero test dependencies. Constitution NON-NEGOTIABLE clause respected |

**Gate Result**: ✅ **PASS** - All principles satisfied. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-goals-ui/
├── spec.md              # Feature specification (complete, clarified)
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 output (dependencies, best practices)
├── data-model.md        # Phase 1 output (Goal entity, localStorage schema)
├── quickstart.md        # Phase 1 output (dev setup, running app)
├── contracts/           # Phase 1 output (API/hook contracts)
│   ├── goals-storage.md
│   └── date-formatting.md
├── checklists/
│   └── requirements.md  # Quality validation checklist
└── tasks.md             # Phase 2 output (implementation tasks)
```

### Source Code (repository root)

```text
app/
├── layout.tsx                           # Root layout with theme provider
├── page.tsx                             # Dashboard home page
├── components/
│   ├── GoalsContainer.tsx               # Main two-column layout
│   ├── GoalColumn.tsx                   # Left (active) or right (completed) column
│   ├── GoalCard.tsx                     # Individual goal item with checkbox & dropdown
│   ├── GoalDropdown.tsx                 # Dropdown menu (Mark Complete, Delete)
│   ├── AddGoalButton.tsx                # Button to open modal
│   ├── AddGoalModal.tsx                 # Modal form (title, end date inputs)
│   ├── EmptyState.tsx                   # Empty column message with encouragement
│   └── DaysRemaining.tsx                # Countdown timer component with highlighting
├── lib/
│   ├── goals-storage.ts                 # localStorage persistence (get, save, delete)
│   ├── date-utils.ts                    # date-fns wrappers (days remaining calc, timezone)
│   ├── types.ts                         # Goal, User TypeScript interfaces
│   └── hooks.ts                         # useGoals, useGoalActions custom hooks
└── styles/
    └── globals.css                      # Tailwind imports, @theme variables for pastels

public/
└── [static assets if needed]

package.json                             # Dependencies: Next, React, Tailwind, date-fns, shadcn/ui
tsconfig.json                            # TypeScript strict mode enabled
next.config.ts
tailwind.config.js                       # @theme pastel color definitions
eslint.config.mjs                        # ESLint 9 configuration
```

**Structure Decision**: Standard Next.js App Router structure with feature-focused components in `/app/components/` and shared logic in `/app/lib/`. This supports independent component testing during development and easy separation of concerns. All files are TypeScript (.ts, .tsx) per constitution requirement.
