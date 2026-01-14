/**
 * Date utility functions using date-fns
 * Handles countdown calculations, formatting, urgency detection
 * All calculations use user's local timezone
 */

import {
  differenceInDays,
  parseISO,
  format,
  startOfDay,
  isAfter,
  isBefore,
  isValid,
} from 'date-fns';
import { ValidationResult } from './types';

/**
 * Calculate days remaining until end date
 * Uses user's local timezone with midnight as deadline
 * @param endDateStr - End date in YYYY-MM-DD format
 * @returns Number of days remaining (negative if past deadline, 0 if due today)
 */
export function calculateDaysRemaining(endDateStr: string): number {
  try {
    const endDate = parseISO(endDateStr);
    const today = startOfDay(new Date());
    const endDateAtMidnight = startOfDay(endDate);
    
    return differenceInDays(endDateAtMidnight, today);
  } catch (error) {
    console.error('Error calculating days remaining:', error);
    return 0;
  }
}

/**
 * Format days remaining for display
 * @param days - Number of days remaining
 * @returns Formatted string like "X days remaining", "Due today", or "Overdue"
 */
export function formatDaysDisplay(days: number): string {
  if (days < 0) {
    return 'Overdue';
  }
  if (days === 0) {
    return 'Due today';
  }
  if (days === 1) {
    return '1 day remaining';
  }
  return `${days} days remaining`;
}

/**
 * Check if a goal is urgent (≤3 days remaining)
 * Overdue goals (days < 0) are also considered urgent
 * @param days - Number of days remaining
 * @returns true if goal is urgent, false otherwise
 */
export function isUrgent(days: number): boolean {
  return days <= 3;
}

/**
 * Validate an end date for goal creation
 * Must be non-empty, valid date format (YYYY-MM-DD), and in the future
 * @param dateStr - Date string to validate
 * @returns ValidationResult with error message if invalid
 */
export function validateEndDate(dateStr: string): ValidationResult {
  // Check empty
  if (!dateStr || dateStr.trim() === '') {
    return {
      valid: false,
      error: 'End date is required',
    };
  }

  // Check format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    return {
      valid: false,
      error: 'End date must be in YYYY-MM-DD format',
    };
  }

  // Check if valid date
  const parsed = parseISO(dateStr);
  if (!isValid(parsed)) {
    return {
      valid: false,
      error: 'End date is not a valid date',
    };
  }

  // Check if date is in the future (must be after today at midnight)
  const today = startOfDay(new Date());
  const endDate = startOfDay(parsed);
  
  if (!isAfter(endDate, today)) {
    return {
      valid: false,
      error: 'End date must be in the future',
    };
  }

  return {
    valid: true,
  };
}

/**
 * Format a date for display
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Formatted date string (e.g., "Jan 15, 2026")
 */
export function formatDateDisplay(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return dateStr;
  }
}

/**
 * Check if date string is valid format
 * @param dateStr - Date string to check
 * @returns true if valid YYYY-MM-DD format and valid date
 */
export function isValidDateFormat(dateStr: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    return false;
  }
  const parsed = parseISO(dateStr);
  return isValid(parsed);
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns Today's date in local timezone
 */
export function getTodayDate(): string {
  const today = startOfDay(new Date());
  return format(today, 'yyyy-MM-dd');
}

/**
 * Get minimum valid date (tomorrow) for date input
 * @returns Tomorrow's date in YYYY-MM-DD format
 */
export function getMinValidDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return format(startOfDay(tomorrow), 'yyyy-MM-dd');
}
