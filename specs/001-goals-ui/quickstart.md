# Quickstart: Goals UI Development

**Phase**: 1 (Design - Quickstart)  
**Date**: 2026-01-14  
**Purpose**: Get the dev environment running in 5 minutes

## Prerequisites

- Node.js 20+ (verify: `node --version`)
- npm 9+ (verify: `npm --version`)
- Git (verify: `git status`)
- Modern web browser (Chrome, Firefox, Safari, Edge - all work)

---

## 1. Install Dependencies

```bash
cd a:\spec-kit

# Install npm packages
npm install

# Confirm new packages added:
# - date-fns: For date calculations
# - shadcn/ui: For component library (may be added via `npx shadcn-ui@latest init`)
```

### Dependency Management
All dependencies are in `package.json`:
```json
{
  "dependencies": {
    "next": "16.1.1",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  "devDependencies": {
    "tailwindcss": "^4",
    "typescript": "^5",
    "eslint": "^9",
    "@tailwindcss/postcss": "^4"
  }
}
```

**NOTE**: No test dependencies (jest, vitest, etc.) - Constitution requirement.

---

## 2. Setup shadcn/ui (One-time)

```bash
# Initialize shadcn/ui with Next.js
npx shadcn-ui@latest init

# When prompted:
# - Use TypeScript? → Yes
# - Use CSS variables for colors? → No (use Tailwind @theme instead)
# - Customize the import alias? → Use default (@/components/ui)
```

This creates:
- `components/ui/` directory with reusable components
- `lib/utils.ts` for className merging utilities

---

## 3. Configure Tailwind @theme for Pastel Colors

Edit `tailwind.config.js`:

```javascript
const colors = require('tailwindcss/colors');

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'pastel-pink': '#FFB3D9',
        'pastel-mint': '#B3E5D9',
        'pastel-lavender': '#D9B3FF',
        'pastel-peach': '#FFD9B3',
        'pastel-sky': '#B3D9FF',
        'urgency': '#FFE0B3', // Warmer for 3-day warning
        'urgency-dark': '#FFD699', // Darker shade if needed
      },
    },
  },
  plugins: [],
};
```

**Usage in Components**:
```tsx
<div className="bg-pastel-pink p-4 rounded-lg">
  Goal card with pink background
</div>

<div className="border-2 border-urgency">
  Urgent goal (≤3 days)
</div>
```

---

## 4. Start Dev Server

```bash
npm run dev

# Output:
# ▲ Next.js 16.1.1
# - Local: http://localhost:3000
# - Environments: .env.local
#
# Ready in 1.2s
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Project Structure Overview

```
a:\spec-kit/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Dashboard page
│   ├── components/
│   │   ├── GoalsContainer.tsx
│   │   ├── GoalColumn.tsx
│   │   ├── GoalCard.tsx
│   │   ├── GoalDropdown.tsx
│   │   ├── AddGoalButton.tsx
│   │   ├── AddGoalModal.tsx
│   │   ├── EmptyState.tsx
│   │   └── DaysRemaining.tsx
│   └── lib/
│       ├── goals-storage.ts    # localStorage utils
│       ├── date-utils.ts       # date-fns wrappers
│       ├── types.ts            # TypeScript interfaces
│       └── hooks.ts            # useGoals, useGoalActions
├── specs/
│   └── 001-goals-ui/
│       ├── spec.md            # Requirements (read-only)
│       ├── plan.md            # This plan
│       ├── data-model.md      # Entity definitions
│       ├── research.md        # Technology decisions
│       ├── contracts/         # API contracts
│       └── tasks.md           # Implementation tasks (Phase 2)
├── package.json
├── tsconfig.json             # TypeScript config (strict: true)
├── tailwind.config.js        # Tailwind colors & theme
└── eslint.config.mjs         # ESLint 9 config (must pass)
```

---

## 6. Code Quality Checks

### TypeScript Compilation
```bash
npx tsc --noEmit

# Should succeed with no errors
# (strict mode enforced by constitution)
```

### ESLint
```bash
npm run lint

# Should show no errors/warnings
# (constitution requirement for clean code)
```

### Fix Auto-fixable Issues
```bash
npm run lint -- --fix

# Automatically fixes formatting, unused vars, etc.
```

---

## 7. Development Workflow

### Edit a Component
```bash
# e.g., app/components/GoalCard.tsx
# Make changes and save (hot reload in browser automatically)
```

### Test a Feature
```bash
# Open browser DevTools (F12)
# Switch to Console tab
# Manually test goal creation, completion, deletion
# Check localStorage in DevTools Application → Local Storage
```

### Check localStorage Data
```javascript
// In browser console:
JSON.parse(localStorage.getItem('doit-goals-v1'))
```

---

## 8. Manual Validation (No Tests)

Since the constitution forbids automated tests, validate manually:

### User Story 1: View Active & Completed Goals
1. Add a few goals via form
2. Verify two-column layout displays correctly
3. Verify countdown timers show correct days
4. Resize browser to test responsiveness (320px, 768px, 1920px)

### User Story 2: Manage Goals
1. Click checkbox on a goal
2. Verify dropdown menu appears with "Mark Complete" and "Delete"
3. Click "Mark Complete" → goal moves to right column
4. Click "Delete" → goal removed permanently

### User Story 3: Highlight Urgent Goals
1. Create goal with end date 3 days from today
2. Verify it's highlighted with urgency color (pastel-peach)
3. Create goal with end date 4 days from today
4. Verify it's NOT highlighted (normal styling)

### User Story 4: Add Goals via Modal
1. Click "Add Goal" button
2. Fill form with title and future date
3. Click Submit → modal closes, goal appears in active column
4. Click Cancel → modal closes without creating goal

---

## 9. Building & Deployment (Optional)

### Build for Production
```bash
npm run build

# Outputs: .next/ directory (optimized)
# Bundle size check: Should be <3MB gzipped
```

### Run Production Build Locally
```bash
npm run start

# Runs optimized production server at http://localhost:3000
```

---

## 10. Troubleshooting

### Issue: ESLint errors on unused variables
**Solution**: 
```bash
npm run lint -- --fix
```

### Issue: Goals disappear after page refresh
**Solution**: Check DevTools → Application → Local Storage → `doit-goals-v1` exists and has data

### Issue: Type errors in components
**Solution**: Ensure all props are typed in `types.ts`, verify component signatures match

### Issue: Tailwind colors not working
**Solution**: Verify `tailwind.config.js` has `pastel-pink` etc. in `theme.extend.colors`

### Issue: shadcn components not found
**Solution**: 
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
# Add any missing shadcn components
```

---

## 11. Commits & Versioning

### Feature Branch
```bash
# Already on branch 001-goals-ui
git branch --show-current  # Verify
```

### Making Commits
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: implement goal card with dropdown menu

- Add checkbox and dropdown menu for Mark Complete / Delete actions
- Update styles with pastel colors
- Add TypeScript types for Goal"

# Push to remote (if applicable)
git push origin 001-goals-ui
```

---

## 12. Next Steps

After completing dev setup:
1. ✅ **Phase 1 complete**: Architecture planned, technologies chosen
2. 🚀 **Phase 2**: Run `/speckit.tasks` to generate implementation task breakdown
3. 📝 **Implementation**: Follow task list to build components one-by-one
4. 🧪 **Validation**: Manually test each user story (no automated tests)
5. ✨ **Deploy**: Merge to main, run `npm run build`, deploy to hosting

---

## Summary

You're ready to start development! The dev environment is set up with:
- ✅ Next.js 16.1.1 + React 19.2.3
- ✅ TypeScript 5 (strict mode)
- ✅ Tailwind CSS 4 (@theme for pastel colors)
- ✅ shadcn/ui (component library)
- ✅ date-fns (date handling)
- ✅ localStorage (goal persistence)
- ✅ ESLint 9 (code quality)
- ❌ **NO test frameworks** (constitution requirement)

Run `npm run dev` and start building! 🚀
