// Performance monitoring utilities
export const performanceMonitor = {
  // Track component render times
  trackRender: (componentName: string) => {
    if (!import.meta.env.DEV) return () => {};
    
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      if (renderTime > 16) { // Only log if render takes longer than 16ms (60fps threshold)
        console.log(`🐌 Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
      }
    };
  },

  // Track API call times
  trackApiCall: async <T>(apiName: string, apiCall: () => Promise<T>): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await apiCall();
      const endTime = performance.now();
      const callTime = endTime - startTime;
      
      if (import.meta.env.DEV && callTime > 1000) { // Log slow API calls (>1s)
        console.log(`🐌 Slow API: ${apiName} took ${callTime.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const callTime = endTime - startTime;
      console.error(`❌ API Error: ${apiName} failed after ${callTime.toFixed(2)}ms`, error);
      throw error;
    }
  },

  // Debounce utility to prevent rapid function calls
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
};