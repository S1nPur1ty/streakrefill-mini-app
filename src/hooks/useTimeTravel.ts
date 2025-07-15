import { useEffect, useRef } from 'react';
import { useAppStore } from '../stores/useAppStore';

/**
 * A hook to handle time travel functionality
 * 
 * Returns time travel state and utility functions
 */
export const useTimeTravel = () => {
  const { 
    isTimeTravelActive,
    currentTestDate,
    getFormattedTestDate,
    advanceDay,
    resetToToday
  } = useAppStore();

  const loggedRef = useRef<boolean | null>(null);

  // Log when time travel status changes, but avoid duplicate logs
  useEffect(() => {
    // Only log if status changed since last render
    if (loggedRef.current !== isTimeTravelActive && import.meta.env.DEV) {
      if (isTimeTravelActive) {
        console.log(`🕰️ Time Travel Active: ${getFormattedTestDate()}`);
      } else {
        console.log('🕰️ Time Travel Inactive: Using current date');
      }
      loggedRef.current = isTimeTravelActive;
    }
  }, [isTimeTravelActive, getFormattedTestDate]);

  // Function to advance multiple days
  const advanceDays = (days: number) => {
    if (!import.meta.env.DEV) {
      console.error('Time travel is only available in development mode');
      return;
    }
    
    for (let i = 0; i < days; i++) {
      advanceDay();
    }
  };

  // Memoize formattedDate to prevent unnecessary re-renders
  const formattedDate = getFormattedTestDate();
  
  return {
    isTimeTravelActive,
    currentTestDate,
    formattedDate,
    advanceDay,
    advanceDays,
    resetToToday,
    isDev: import.meta.env.DEV
  };
}; 