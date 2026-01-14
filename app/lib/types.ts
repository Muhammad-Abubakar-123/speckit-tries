/**
 * TypeScript type definitions for doit goal tracking app
 * Defines core entities: Goal, User, GoalStatus
 */

/** Goal status enum */
export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

/** Goal entity as stored in localStorage */
export interface Goal {
  /** Unique identifier (UUID) */
  id: string;
  
  /** Goal title (1-500 characters) */
  title: string;
  
  /** End date in YYYY-MM-DD format, interpreted as midnight in user's local timezone */
  endDate: string;
  
  /** Goal status: active or completed */
  status: GoalStatus;
  
  /** ISO timestamp when goal was created */
  createdDate: string;
}

/** User entity (single user MVP) */
export interface User {
  id: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notificationSettings?: Record<string, boolean>;
  };
}

/** localStorage schema structure */
export interface StorageSchema {
  goals: Goal[];
}

/** Response type for goal operations */
export interface GoalActionResult {
  success: boolean;
  error?: string;
  goal?: Goal;
}

/** Form validation result */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}
