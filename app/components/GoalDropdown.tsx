/**
 * GoalDropdown Component
 * Dropdown menu with "Mark Complete" and "Delete" actions
 * Positioned absolutely under the goal card
 */

interface GoalDropdownProps {
  goalId: string;
  goalTitle: string;
  onComplete: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function GoalDropdown({
  goalId,
  goalTitle,
  onComplete,
  onDelete,
  onClose,
}: GoalDropdownProps) {
  return (
    <>
      {/* Backdrop to close dropdown */}
      <div
        className="fixed inset-0 z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dropdown menu */}
      <div
        className="
          absolute top-full left-0 mt-2 w-48 rounded-lg
          border border-gray-200 bg-white shadow-lg z-20
          overflow-hidden
        "
        role="menu"
        aria-label={`Actions for goal: ${goalTitle}`}
      >
        <button
          onClick={onComplete}
          className="
            w-full px-4 py-2.5 text-left text-sm font-medium
            text-gray-900 hover:bg-pastel-mint transition-colors
            flex items-center gap-2
          "
          role="menuitem"
        >
          <span className="text-lg">✓</span>
          Mark Complete
        </button>

        <div className="border-t border-gray-200" />

        <button
          onClick={onDelete}
          className="
            w-full px-4 py-2.5 text-left text-sm font-medium
            text-red-600 hover:bg-red-50 transition-colors
            flex items-center gap-2
          "
          role="menuitem"
        >
          <span className="text-lg">🗑</span>
          Delete
        </button>
      </div>
    </>
  );
}
