/**
 * localStorage utilities for persisting and managing goals
 * Handles CRUD operations for goals with error handling for quota exceeded
 */

import { Goal, StorageSchema, GoalStatus } from './types';

const STORAGE_KEY = 'doit-goals-v1';

/**
 * Load all goals from localStorage
 * @returns Array of goals or empty array if storage is unavailable
 */
export function loadGoals(): Goal[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    const schema: StorageSchema = JSON.parse(data);
    return schema.goals || [];
  } catch (error) {
    console.error('Failed to load goals from localStorage:', error);
    return [];
  }
}

/**
 * Save goals to localStorage
 * @param goals - Array of goals to persist
 * @returns true if save succeeded, false if quota exceeded or unavailable
 */
export function saveGoals(goals: Goal[]): boolean {
  try {
    const schema: StorageSchema = { goals };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schema));
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded');
      return false;
    }
    console.error('Failed to save goals to localStorage:', error);
    return false;
  }
}

/**
 * Check if localStorage is available and writable
 * @returns true if localStorage is available and has space, false otherwise
 */
export function validateStorage(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      return false;
    }
    // localStorage disabled
    return false;
  }
}

/**
 * Delete a single goal by ID
 * @param goalId - ID of goal to delete
 * @returns true if delete succeeded, false otherwise
 */
export function deleteGoalById(goalId: string): boolean {
  try {
    const goals = loadGoals();
    const filtered = goals.filter(g => g.id !== goalId);
    return saveGoals(filtered);
  } catch (error) {
    console.error('Failed to delete goal:', error);
    return false;
  }
}

/**
 * Update a goal's status (active → completed or vice versa)
 * @param goalId - ID of goal to update
 * @param newStatus - New status
 * @returns Updated goal or null if not found
 */
export function updateGoalStatus(goalId: string, newStatus: GoalStatus): Goal | null {
  try {
    const goals = loadGoals();
    const goal = goals.find(g => g.id === goalId);
    
    if (!goal) {
      return null;
    }
    
    goal.status = newStatus;
    
    if (!saveGoals(goals)) {
      return null; // Quota exceeded or other storage error
    }
    
    return goal;
  } catch (error) {
    console.error('Failed to update goal status:', error);
    return null;
  }
}

/**
 * Add a new goal to storage
 * @param goal - New goal to add
 * @returns true if add succeeded, false if quota exceeded
 */
export function addGoal(goal: Goal): boolean {
  try {
    const goals = loadGoals();
    goals.push(goal);
    return saveGoals(goals);
  } catch (error) {
    console.error('Failed to add goal:', error);
    return false;
  }
}
