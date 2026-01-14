/**
 * GoalsContainer Component
 * Main two-column layout for displaying active and completed goals
 * Manages overall state and goal interactions
 */

'use client';

import { useEffect, useState } from 'react';
import { Goal, GoalStatus } from '@/app/lib/types';
import { useGoals } from '@/app/lib/hooks';
import { loadGoals, saveGoals } from '@/app/lib/goals-storage';
import { calculateDaysRemaining } from '@/app/lib/date-utils';
import { GoalColumn } from './GoalColumn';
import { AddGoalButton } from './AddGoalButton';
import { AddGoalModal } from './AddGoalModal';

export function GoalsContainer() {
  const { activeGoals, completedGoals, loading } = useGoals();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  // Load goals on mount
  useEffect(() => {
    const loadedGoals = loadGoals();
    setGoals(loadedGoals);
  }, []);

  // Refresh function to reload goals after mutations
  const refreshGoals = () => {
    const loadedGoals = loadGoals();
    setGoals(loadedGoals);
  };

  // Handle goal completion
  const handleCompleteGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      goal.status = GoalStatus.COMPLETED;
      if (saveGoals(goals)) {
        setStorageError(null);
        refreshGoals();
      } else {
        setStorageError('Storage full or disabled. Clear browser data or delete goals to continue.');
      }
    }
  };

  // Handle goal deletion
  const handleDeleteGoal = (goalId: string) => {
    const filtered = goals.filter(g => g.id !== goalId);
    if (saveGoals(filtered)) {
      setStorageError(null);
      setGoals(filtered);
    } else {
      setStorageError('Storage full or disabled. Clear browser data or delete goals to continue.');
    }
  };

  // Handle new goal creation
  const handleAddGoal = (title: string, endDate: string): boolean => {
    try {
      const newGoal: Goal = {
        id: generateUUID(),
        title: title.trim(),
        endDate,
        status: GoalStatus.ACTIVE,
        createdDate: new Date().toISOString(),
      };

      const updatedGoals = [...goals, newGoal];
      if (saveGoals(updatedGoals)) {
        setStorageError(null);
        setGoals(updatedGoals);
        setShowModal(false);
        return true;
      } else {
        setStorageError('Storage full or disabled. Clear browser data or delete goals to continue.');
        return false;
      }
    } catch (error) {
      console.error('Error adding goal:', error);
      return false;
    }
  };

  // Separate active and completed goals
  const active = goals.filter(g => g.status === GoalStatus.ACTIVE);
  const completed = goals.filter(g => g.status === GoalStatus.COMPLETED);

  // Sort active by deadline ascending
  active.sort((a, b) => {
    const daysA = calculateDaysRemaining(a.endDate);
    const daysB = calculateDaysRemaining(b.endDate);
    return daysA - daysB;
  });

  // Sort completed by creation date descending
  completed.sort((a, b) => {
    return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Storage error message */}
      {storageError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-medium">{storageError}</p>
        </div>
      )}

      {/* Add Goal Button */}
      <AddGoalButton
        onClick={() => setShowModal(true)}
        disabled={!!storageError}
      />

      {/* Add Goal Modal */}
      {showModal && (
        <AddGoalModal
          onSubmit={handleAddGoal}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Active Goals Column */}
        <GoalColumn
          title="Active Goals"
          goals={active}
          columnType="active"
          onComplete={handleCompleteGoal}
          onDelete={handleDeleteGoal}
        />

        {/* Completed Goals Column */}
        <GoalColumn
          title="Completed Goals"
          goals={completed}
          columnType="completed"
          onComplete={handleCompleteGoal}
          onDelete={handleDeleteGoal}
        />
      </div>
    </div>
  );
}

/**
 * Generate a UUID v4 for goal IDs
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
