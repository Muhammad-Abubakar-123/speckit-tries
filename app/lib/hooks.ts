/**
 * Custom React hooks for goal management
 * useGoals: Load and manage goal state from localStorage
 * useGoalActions: Perform CRUD operations on goals
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { Goal, GoalStatus } from './types';
import {
  loadGoals,
  deleteGoalById,
  updateGoalStatus,
  addGoal,
  validateStorage,
} from './goals-storage';
import { calculateDaysRemaining } from './date-utils';

/**
 * Custom hook to load and manage goals from localStorage
 * Returns sorted arrays: active goals (by deadline ascending), completed goals
 */
export function useGoals(): {
  activeGoals: Goal[];
  completedGoals: Goal[];
  loading: boolean;
} {
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  // Load goals on component mount
  useEffect(() => {
    const goals = loadGoals();
    
    // Separate and sort
    const active = goals.filter(g => g.status === GoalStatus.ACTIVE);
    const completed = goals.filter(g => g.status === GoalStatus.COMPLETED);
    
    // Sort active goals by deadline (earliest first)
    active.sort((a, b) => {
      const daysA = calculateDaysRemaining(a.endDate);
      const daysB = calculateDaysRemaining(b.endDate);
      return daysA - daysB;
    });
    
    // Sort completed goals by creation date (newest first)
    completed.sort((a, b) => {
      return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    });
    
    setActiveGoals(active);
    setCompletedGoals(completed);
    setLoading(false);
  }, []);

  return { activeGoals, completedGoals, loading };
}

/**
 * Custom hook for goal actions (add, complete, delete)
 * Provides methods to mutate goals and returns storage availability status
 */
export function useGoalActions(): {
  addGoal: (title: string, endDate: string) => boolean;
  completeGoal: (goalId: string) => boolean;
  deleteGoal: (goalId: string) => boolean;
  storageAvailable: boolean;
} {
  const [storageAvailable, setStorageAvailable] = useState(true);

  // Check storage on mount
  useEffect(() => {
    const available = validateStorage();
    setStorageAvailable(available);
  }, []);

  const addNewGoal = useCallback((title: string, endDate: string): boolean => {
    try {
      const newGoal: Goal = {
        id: generateUUID(),
        title: title.trim(),
        endDate,
        status: GoalStatus.ACTIVE,
        createdDate: new Date().toISOString(),
      };

      const success = addGoal(newGoal);
      
      if (!success) {
        setStorageAvailable(false);
      }

      return success;
    } catch (error) {
      console.error('Error adding goal:', error);
      return false;
    }
  }, []);

  const markComplete = useCallback((goalId: string): boolean => {
    try {
      const goal = updateGoalStatus(goalId, GoalStatus.COMPLETED);
      return goal !== null;
    } catch (error) {
      console.error('Error completing goal:', error);
      return false;
    }
  }, []);

  const removeGoal = useCallback((goalId: string): boolean => {
    try {
      const success = deleteGoalById(goalId);
      return success;
    } catch (error) {
      console.error('Error deleting goal:', error);
      return false;
    }
  }, []);

  return {
    addGoal: addNewGoal,
    completeGoal: markComplete,
    deleteGoal: removeGoal,
    storageAvailable,
  };
}

/**
 * Generate a UUID v4
 * Simple implementation for client-side unique IDs
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
