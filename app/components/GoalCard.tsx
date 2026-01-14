/**
 * GoalCard Component  
 * Displays a single goal with title, checkbox, and countdown
 * Shows/hides dropdown menu on checkbox interaction
 */

'use client';

import { useState } from 'react';
import { Goal } from '@/app/lib/types';
import { calculateDaysRemaining, isUrgent } from '@/app/lib/date-utils';
import { DaysRemaining } from './DaysRemaining';
import { GoalDropdown } from './GoalDropdown';

interface GoalCardProps {
  goal: Goal;
  onComplete: (goalId: string) => void;
  onDelete: (goalId: string) => void;
}

export function GoalCard({
  goal,
  onComplete,
  onDelete,
}: GoalCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const daysRemaining = calculateDaysRemaining(goal.endDate);
  const urgent = isUrgent(daysRemaining);

  // Truncate title based on screen size - handled via CSS
  // Max: 500 chars full, 50 chars on tablet/mobile (CSS will overflow with ellipsis)

  const handleCheckboxClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCompleteClick = () => {
    onComplete(goal.id);
    setShowDropdown(false);
  };

  const handleDeleteClick = () => {
    onDelete(goal.id);
    setShowDropdown(false);
  };

  return (
    <div
      className={`
        group relative rounded-lg border-2 p-4 transition-all duration-200
        hover:shadow-md
        ${urgent ? 'border-pastel-peach bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          onClick={handleCheckboxClick}
          className="
            mt-1 h-5 w-5 rounded cursor-pointer
            accent-pastel-peach
            focus:ring-2 focus:ring-pastel-peach focus:ring-offset-1
          "
          aria-label={`Mark "${goal.title}" complete or delete`}
        />

        {/* Goal content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate mb-2 hover:text-clip" title={goal.title}>
            {goal.title}
          </h3>
          <DaysRemaining days={daysRemaining} />
        </div>
      </div>

      {/* Dropdown menu */}
      {showDropdown && (
        <GoalDropdown
          goalId={goal.id}
          goalTitle={goal.title}
          onComplete={handleCompleteClick}
          onDelete={handleDeleteClick}
          onClose={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
