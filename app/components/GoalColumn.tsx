/**
 * GoalColumn Component
 * Displays a column of goals (active or completed)
 * Handles empty state when no goals in column
 */

import { Goal } from '@/app/lib/types';
import { GoalCard } from './GoalCard';
import { EmptyState } from './EmptyState';

interface GoalColumnProps {
  title: string;
  goals: Goal[];
  columnType: 'active' | 'completed';
  onComplete: (goalId: string) => void;
  onDelete: (goalId: string) => void;
}

export function GoalColumn({
  title,
  goals,
  columnType,
  onComplete,
  onDelete,
}: GoalColumnProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Column header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {title}
        </h2>
        <p className="text-sm text-gray-600">
          {goals.length} {goals.length === 1 ? 'goal' : 'goals'}
        </p>
      </div>

      {/* Goals list or empty state */}
      <div className="flex-1">
        {goals.length === 0 ? (
          <EmptyState columnType={columnType} />
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
