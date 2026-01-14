/**
 * DaysRemaining Component
 * Displays countdown timer with urgency highlighting
 * Shows "X days remaining", "Due today", or "Overdue"
 */

import { formatDaysDisplay, isUrgent } from '@/app/lib/date-utils';

interface DaysRemainingProps {
  days: number;
  className?: string;
}

export function DaysRemaining({ days, className = '' }: DaysRemainingProps) {
  const urgent = isUrgent(days);
  const displayText = formatDaysDisplay(days);

  // Base classes
  let bgColor = 'bg-gray-50';
  let textColor = 'text-gray-700';
  let borderColor = 'border-gray-200';

  // Apply urgency styling for ≤3 days (including overdue)
  if (urgent) {
    bgColor = 'bg-pastel-peach';
    textColor = 'text-orange-900';
    borderColor = 'border-pastel-peach';
  }

  return (
    <div
      className={`
        inline-block px-3 py-1.5 rounded-full text-sm font-medium
        border ${borderColor} ${bgColor} ${textColor}
        transition-colors duration-200
        ${className}
      `}
    >
      {displayText}
    </div>
  );
}
