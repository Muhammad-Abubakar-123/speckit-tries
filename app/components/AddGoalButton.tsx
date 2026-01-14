/**
 * AddGoalButton Component
 * Button to trigger the add goal modal
 * Disabled when storage is full/unavailable
 */

interface AddGoalButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function AddGoalButton({ onClick, disabled = false }: AddGoalButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-lg font-semibold text-white
        transition-all duration-200
        flex items-center gap-2
        ${
          disabled
            ? 'bg-gray-400 cursor-not-allowed opacity-60'
            : 'bg-gradient-to-r from-pink-700 via-pink-500 to-pink-700 hover:shadow-lg hover:scale-105 active:scale-95'
        }
      `}
      aria-label="Add a new goal"
      title={disabled ? 'Storage full or disabled' : 'Add a new goal'}
    >
      <span className="text-xl text-white">➕</span>
      <span>Add Goal</span>
    </button>
  );
}
