<!-- 
SYNC IMPACT REPORT - Constitution v1.0.0 (Initial)
Generated: 2026-01-13

VERSION CHANGE: New → 1.0.0 (MINOR - Initial project constitution)

PRINCIPLES ESTABLISHED (5 total):
1. I. Clean Code - Readability, maintainability, TypeScript strict mode, ESLint enforcement
2. II. Simple UX - User-centric design, minimize cognitive load
3. III. Responsive Design - Mobile-first, Tailwind CSS 4, viewport testing
4. IV. Minimal Dependencies - Essential packages only, prefer built-in capabilities
5. V. No Testing (NON-NEGOTIABLE) - Zero tolerance for test infrastructure

TECHNOLOGY STACK LOCKED:
- Next.js 16.1.1, React 19.2.3, Tailwind CSS 4, TypeScript 5, ESLint 9, Node 20
- All code MUST be TypeScript (.tsx for components)

SECTIONS ADDED:
- Technology Stack & Versions (hard requirements)
- Development Guidelines (code organization, quality standards, performance)
- Governance (authority, amendment process, version semantics, compliance verification)

TEMPLATES UPDATED FOR ALIGNMENT:
✅ .specify/templates/tasks-template.md
   - Removed all test task sections (T010, T011, T018, T019, T024, T025)
   - Updated "Tests" header: NO TESTS permitted (Constitution binding)
   - Removed unit test task from Phase N polish section
   
✅ .specify/templates/spec-template.md
   - Renamed "User Scenarios & Testing" → "User Scenarios & Acceptance Criteria"
   - Changed "Independent Test" → "Independent Validation" (manual, not automated)
   - Added note: "No automated tests. See Constitution: No Testing (NON-NEGOTIABLE)."
   
✅ .specify/templates/plan-template.md
   - Removed "Testing" field from Technical Context section
   - Updated Project Structure: Single project → Next.js App Router structure (app/, public/)
   - Removed outdated project layout options (backend/frontend/tests, mobile patterns)

TEMPLATES NOT REQUIRING CHANGES:
- .specify/templates/checklist-template.md (generic, no test references)
- .specify/templates/agent-file-template.md (generic guidelines generator)

COMPLIANCE GATES:
All future code MUST pass:
- No Testing principle enforcement (automated tooling: forbid test/* directories, test-related deps)
- TypeScript strict mode verification
- ESLint 9 compliance (npm run lint)
- Responsive design validation (manual review at breakpoints: 320px, 768px, 1920px)
- Dependency review: Every new package requires explicit constitution justification

FOLLOW-UP NOTES:
- None: All required placeholders have been replaced with concrete values
- Constitution is complete and immediately enforceable
- Consider adding pre-commit hooks to enforce "No Testing" principle (validate package.json excludes test frameworks)
-->

# Spec-Kit Constitution

## Core Principles

### I. Clean Code
All code MUST be readable, maintainable, and self-documenting. Use TypeScript strict mode, follow ESLint configuration, maintain consistent formatting, use descriptive naming, and keep functions/components focused on a single responsibility. No code smells or shortcuts.

### II. Simple UX
User interfaces MUST prioritize simplicity and clarity. Design for the happy path first; minimize cognitive load; reduce visual complexity; use consistent patterns; provide clear feedback for user actions. Features must be intuitive without documentation.

### III. Responsive Design
All UI components and pages MUST be fully responsive across all screen sizes (mobile-first approach). Use Tailwind CSS 4 for all styling; test layouts at 320px, 768px, and 1920px breakpoints; ensure touch-friendly interfaces on mobile devices; optimize images and load performance across all device types.

### IV. Minimal Dependencies
Only include dependencies that provide essential functionality and cannot be reasonably implemented in-house. Evaluate every new package for:
- Does it reduce code complexity significantly?
- Is it actively maintained and secure?
- Can we achieve the same outcome with core library features?

Prefer Next.js, React, and Tailwind built-in capabilities over third-party packages.

### V. No Testing (NON-NEGOTIABLE - SUPERSEDES ALL OTHER GUIDANCE)
This project explicitly contains NO unit tests, NO integration tests, and NO e2e tests. Testing infrastructure (test frameworks, test runners, mock libraries) MUST NOT be added to the project under any circumstances, regardless of other guidance or best practices that typically recommend testing.

## Technology Stack & Versions

The following versions MUST be used and maintained as specified:

- **Next.js**: 16.1.1
- **React**: 19.2.3  
- **React DOM**: 19.2.3
- **Tailwind CSS**: 4
- **TypeScript**: 5
- **ESLint**: 9
- **Node.js**: 20 (implied by package.json)

All project code must be written in TypeScript. No JavaScript files except configuration files where necessary (e.g., `next.config.ts`, `eslint.config.mjs`).

## Development Guidelines

### Code Organization
- Source code: `app/` directory (Next.js App Router structure)
- Components: Co-locate with pages using `.tsx` format
- Public assets: `public/` directory
- Styling: Tailwind CSS utility classes exclusively (no external CSS frameworks)

### Code Quality Standards
- Use TypeScript strict mode in `tsconfig.json`
- Run `npm run lint` before committing; all lint errors must be resolved
- No console.log statements in production code; use appropriate logging when needed
- Handle all errors explicitly; no unhandled promises or exceptions
- Prefer functional components; use hooks for state management

### Performance & Constraints
- Minimize bundle size; lazy-load components when practical
- Optimize images using Next.js Image component
- Leverage Next.js built-in optimizations (code splitting, pre-rendering)
- No external CDN dependencies beyond what Next.js provides
- Page load time target: < 3 seconds on 3G networks

## Governance

### Constitution Authority
This Constitution supersedes all other development guidance and practices. Any conflict between this document and other documentation must be resolved in favor of this Constitution.

### Amendment Process
Amendments to this Constitution require:
1. Written proposal documenting the change and rationale
2. Evidence that the change improves alignment with core principles
3. Documentation of any cascading impacts to development practices
4. Explicit version bump according to semantic versioning

### Version Semantics
- **MAJOR**: Principle removal, principle redefinition, or critical technology change
- **MINOR**: New principle added, significant guidance expansion
- **PATCH**: Clarifications, wording improvements, non-semantic refinements

### Compliance Verification
All code changes MUST be verified against:
- The No Testing principle (no test files added)
- Technology version requirements
- Code quality standards via ESLint
- The four foundational principles (Clean Code, Simple UX, Responsive Design, Minimal Dependencies)

**Version**: 1.0.0 | **Ratified**: 2026-01-13 | **Last Amended**: 2026-01-13
