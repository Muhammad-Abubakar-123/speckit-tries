# Feature Specification: Initial Page Setup - Doit Goal Tracking App

**Feature Branch**: `001-goals-ui`  
**Created**: 2026-01-14  
**Status**: Draft  
**Input**: User description: "Initial page setup- this application should be a goal tracking web app called 'doit'. There should be two columns - a left one where current goals are shown , along with how many days left the user has to achieve the goal, and a right one where completed goals are. Each goal can be 'checked' using a checkbox, and then either moved to the completed side coulum or permantly deleted. To add new goals, a user can click on a button to open a new goal form in a model (title and end date fields). Goals reaching their end date (within 3 days) are highlighted. Let's use a modern light there with fun pastel colours."

## Clarifications

### Session 2026-01-14

- Q: How should deadline dates be interpreted across timezones? → A: User's local timezone (browser timezone) with midnight as the deadline
- Q: What UX pattern for goal actions (complete/delete)? → A: Checkbox enables selection; dropdown menu appears with "Mark Complete" and "Delete" options
- Q: How to handle localStorage disabled or quota exceeded? → A: Disable "Add Goal" button and show error message

## User Scenarios & Acceptance Criteria *(mandatory)*

### User Story 1 - View Active and Completed Goals (Priority: P1)

A user opens the doit app and sees their goals organized in a clean two-column layout. The left column displays active goals with countdown timers showing how many days remain. The right column shows completed goals. The interface uses a modern light theme with fun pastel colors that create an encouraging, approachable atmosphere.

**Why this priority**: This is the core MVP feature. Without it, users cannot see their goals or understand their progress. This alone provides value: goal visibility and progress tracking.

**Independent Validation**: Can be fully validated by loading the app and confirming the two-column layout displays correctly with sample goals, showing days remaining on active goals and completed status on the right column.

**Acceptance Scenarios**:

1. **Given** a user with some active and completed goals, **When** they open the app, **Then** they see active goals on the left with "X days remaining" and completed goals on the right
2. **Given** the dashboard is displayed, **When** the user views active goals, **Then** each goal shows its title and countdown timer with remaining days
3. **Given** multiple goals exist, **When** the user views the page, **Then** the layout is responsive and viewable on mobile, tablet, and desktop screens

---

### User Story 2 - Manage Goals with Checkboxes (Priority: P2)

A user can interact with their goals using checkboxes. Checking a box allows them to move a goal to the completed column or permanently delete it. This provides immediate feedback and control over goal status.

**Why this priority**: Essential for goal management. Without this, users cannot mark progress or clean up their goal list. Adds interactivity to the core view.

**Independent Validation**: Can be fully validated by checking a goal's checkbox on the active side, then confirming it either moves to completed or can be deleted, with appropriate user feedback.

**Acceptance Scenarios**:

1. **Given** an active goal with a checkbox, **When** the user clicks the checkbox, **Then** the goal is visually marked/selected and a dropdown menu appears with "Mark Complete" and "Delete" options
2. **Given** a marked goal with dropdown visible, **When** the user selects "Mark Complete" from the dropdown, **Then** the goal moves to the completed column on the right
3. **Given** a marked goal with dropdown visible, **When** the user selects "Delete" from the dropdown, **Then** the goal is permanently removed with no undo

---

### User Story 3 - Highlight Urgent Goals (Priority: P2)

Goals approaching their deadline are visually highlighted to draw attention. When a goal has 3 or fewer days remaining, it receives special styling using the pastel color palette to indicate urgency without alarm.

**Why this priority**: Critical UX enhancement that helps users prioritize. Prevents missed deadlines by making deadlines visually prominent. Delivers value independently while enhancing P1 and P2.

**Independent Validation**: Can be fully validated by viewing goals with various remaining days and confirming visual highlight appears on goals with ≤3 days remaining.

**Acceptance Scenarios**:

1. **Given** an active goal with 4 days remaining, **When** the page displays the goal, **Then** it shows normal styling without urgency highlight
2. **Given** an active goal with 3 days remaining, **When** the page displays the goal, **Then** it is highlighted with a distinct pastel background or border
3. **Given** an active goal with 0 days remaining (due today), **When** the page displays the goal, **Then** it receives the most prominent highlight styling

---

### User Story 4 - Add New Goals via Modal Form (Priority: P3)

A user can click an "Add Goal" button to open a modal dialog containing a form with two fields: goal title and end date. After filling in the form, they can submit to create a new goal that appears in the active goals column.

**Why this priority**: Enables goal creation, completing the core feature set. Can be added after the initial view and management features work, making it P3 for independent MVP slicing.

**Independent Validation**: Can be fully validated by clicking the "Add Goal" button, filling the modal form with title and date, submitting, and confirming the new goal appears in the active goals column with correct countdown.

**Acceptance Scenarios**:

1. **Given** the dashboard is displayed, **When** the user clicks the "Add Goal" button, **Then** a modal dialog opens with title and end date input fields
2. **Given** a modal form is open, **When** the user fills in a title and valid future date and clicks Submit, **Then** the modal closes and the new goal appears in the active column
3. **Given** a modal form is open, **When** the user clicks Cancel or clicks outside the modal, **Then** the modal closes without creating a goal

---

### Edge Cases

- What happens when a user has no active goals? System displays empty state message in the left column with encouragement to add a goal
- What happens when a user has no completed goals? System displays empty state in the right column
- How does the app handle goals that have passed their due date? Goals with negative days display "Overdue" instead of day count and remain highlighted
- How does the system handle very long goal titles? Titles are truncated with ellipsis on small screens; full title visible on hover or in expanded view
- What happens if localStorage is disabled or quota exceeded? Add Goal button is disabled and error message "Storage full or disabled. Clear browser data or delete goals to continue." is displayed. Users can still view and delete existing goals to free up space.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display goals in a two-column layout (active left, completed right) on page load
- **FR-002**: System MUST calculate and display the number of days remaining for each active goal based on its end date. Days are calculated in the user's local timezone (browser timezone) with midnight as the deadline. A goal due on Jan 15 viewed on Jan 13 at 11pm shows "2 days remaining"
- **FR-003**: System MUST highlight active goals with 3 or fewer days remaining using distinct pastel styling
- **FR-004**: System MUST display goals with a checkbox to enable selection. When checkbox is clicked, the goal is marked as selected and a dropdown menu appears with "Mark Complete" and "Delete" actions
- **FR-005**: System MUST allow users to move a checked goal from active to completed column
- **FR-006**: System MUST allow users to permanently delete a checked goal
- **FR-007**: System MUST persist goal data in localStorage so it survives page refreshes. If localStorage is disabled or quota is exceeded, the "Add Goal" button MUST be disabled and an error message MUST be displayed: "Storage full or disabled. Clear browser data or delete goals to continue."
- **FR-008**: System MUST display an "Add Goal" button that opens a modal form
- **FR-009**: System MUST validate the modal form to require a non-empty title and a valid future date
- **FR-010**: System MUST immediately add new goals to the active column after successful form submission
- **FR-011**: System MUST use a modern light theme with fun pastel colors for visual appeal
- **FR-012**: System MUST be fully responsive and usable on mobile (320px), tablet (768px), and desktop (1920px) viewports

### Key Entities

- **Goal**: A user's objective to accomplish. Attributes: ID (unique identifier), title (string), endDate (ISO date stored as YYYY-MM-DD; interpreted as midnight in user's local timezone), status (enum: active or completed), createdDate (timestamp). Relationships: belongs to user.
- **User**: The person using the app (assumed single user for MVP). Attributes: ID, preferences (theme, notification settings). Relationships: has many goals.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User can view, create, and manage goals in under 30 seconds from page load to completed interaction
- **SC-002**: Page loads and renders the complete two-column layout in under 1 second on 3G networks
- **SC-003**: 100% of responsive breakpoints (320px, 768px, 1920px) render correctly with no layout shifts or overflow
- **SC-004**: 95% of users successfully complete the "add new goal" workflow on first attempt without errors
- **SC-005**: Goals with ≤3 days remaining are visually distinct and immediately recognizable to 100% of users viewing the page
- **SC-006**: Page persists all goals across browser refresh (data loss = 0%)
- **SC-007**: Modal form validation provides clear error messages in under 200ms when validation fails
- **SC-008**: Completed goals can be moved or deleted with a single click action
