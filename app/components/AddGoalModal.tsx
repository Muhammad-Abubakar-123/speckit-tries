/**
 * AddGoalModal Component
 * Modal form for creating new goals
 * Handles title and end date input with validation
 */

'use client';

import { useState } from 'react';
import { validateEndDate, getMinValidDate } from '@/app/lib/date-utils';

interface AddGoalModalProps {
  onSubmit: (title: string, endDate: string) => boolean;
  onClose: () => void;
}

export function AddGoalModal({ onSubmit, onClose }: AddGoalModalProps) {
  const [title, setTitle] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState<{ title?: string; endDate?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { title?: string; endDate?: string } = {};

    // Validate title
    if (!title || title.trim().length === 0) {
      newErrors.title = 'Goal title is required';
    } else if (title.length > 500) {
      newErrors.title = 'Goal title must be 500 characters or less';
    }

    // Validate end date
    const dateValidation = validateEndDate(endDate);
    if (!dateValidation.valid) {
      newErrors.endDate = dateValidation.error || 'Invalid end date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const success = onSubmit(title, endDate);
    setIsSubmitting(false);

    if (success) {
      // Clear form and close
      setTitle('');
      setEndDate('');
      setErrors({});
    }
  };

  const minDate = getMinValidDate();

  return (
    <>
      {/* Modal backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal content */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          // Close only if clicking the backdrop area
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          className="w-full max-w-md rounded-lg bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-bold text-gray-900">Add New Goal</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
            {/* Title input */}
            <div>
              <label
                htmlFor="goal-title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Goal Title
              </label>
              <input
                id="goal-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) {
                    setErrors({ ...errors, title: undefined });
                  }
                }}
                maxLength={500}
                placeholder="What do you want to achieve?"
                className={`
                  w-full px-3 py-2 rounded-lg border-2 font-body
                  focus:outline-none focus:ring-2 focus:ring-offset-1
                  transition-colors duration-200
                  ${
                    errors.title
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-pastel-pink focus:ring-pastel-pink'
                  }
                `}
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {title.length}/500 characters
              </p>
            </div>

            {/* End date input */}
            <div>
              <label
                htmlFor="goal-end-date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                End Date
              </label>
              <input
                id="goal-end-date"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (errors.endDate) {
                    setErrors({ ...errors, endDate: undefined });
                  }
                }}
                min={minDate}
                className={`
                  w-full px-3 py-2 rounded-lg border-2 font-body
                  focus:outline-none focus:ring-2 focus:ring-offset-1
                  transition-colors duration-200
                  ${
                    errors.endDate
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-pastel-pink focus:ring-pastel-pink'
                  }
                `}
              />
              {errors.endDate && (
                <p className="text-sm text-red-600 mt-1">{errors.endDate}</p>
              )}
            </div>
          </form>

          {/* Footer with actions */}
          <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="
                flex-1 px-4 py-2 rounded-lg font-medium
                border-2 border-gray-300 text-gray-700
                hover:bg-gray-50 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="
                flex-1 px-4 py-2 rounded-lg font-medium
                bg-gradient-to-r from-pastel-pink to-pastel-peach text-white
                hover:shadow-lg transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
