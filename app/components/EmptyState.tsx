/**
 * EmptyState Component
 * Displays encouraging message when a column has no goals
 */

interface EmptyStateProps {
  columnType: 'active' | 'completed';
  className?: string;
}

export function EmptyState({ columnType, className = '' }: EmptyStateProps) {
  const isActive = columnType === 'active';

  const title = isActive ? 'No active goals yet' : 'No completed goals yet';
  const message = isActive
    ? 'Start your journey! Click "Add Goal" to create your first goal and begin achieving your objectives.'
    : 'Complete your goals and they will appear here. Keep up the great work!';

  return (
    <div
      className={`
        flex flex-col items-center justify-center py-12 px-4
        rounded-lg border-2 border-dashed border-gray-300
        bg-gradient-to-br from-gray-50 to-white
        text-center
        ${className}
      `}
    >
      <div className="text-5xl mb-4">
        {isActive ? '✨' : '🎉'}
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 max-w-sm">
        {message}
      </p>
    </div>
  );
}
