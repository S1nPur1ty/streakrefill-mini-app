import { useAppStore } from '../stores/useAppStore';

/**
 * Get the current date string in YYYY-MM-DD format, respecting time travel state
 * This can be used in both components and services
 */
export const getCurrentDateString = (): string => {
  // Get the current app state
  const state = useAppStore.getState();
  
  // If time travel is active and we're in development mode, use the test date
  if (state.currentTestDate && import.meta.env.DEV) {
    return state.currentTestDate.toISOString().split('T')[0];
  }
  
  // Otherwise use the actual current date
  return new Date().toISOString().split('T')[0];
};

/**
 * Get a Date object for the current date, respecting time travel state
 */
export const getCurrentDate = (): Date => {
  // Get the current app state
  const state = useAppStore.getState();
  
  // If time travel is active and we're in development mode, use the test date
  if (state.currentTestDate && import.meta.env.DEV) {
    return new Date(state.currentTestDate);
  }
  
  // Otherwise use the actual current date
  return new Date();
}; 