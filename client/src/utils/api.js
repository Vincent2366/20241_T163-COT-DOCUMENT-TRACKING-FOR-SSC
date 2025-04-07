// Global timeout handler
const handleTimeout = (message = 'Request timeout') => {
  try {
    // Record timeout in localStorage
    const timeouts = JSON.parse(localStorage.getItem('timeouts') || '[]');
    timeouts.push({
      timestamp: Date.now(),
      message
    });
    
    // Keep only the last 10 timeouts
    if (timeouts.length > 10) {
      timeouts.shift();
    }
    
    localStorage.setItem('timeouts', JSON.stringify(timeouts));
    
    // Also suppress this error
    const suppressedErrors = JSON.parse(localStorage.getItem('suppressedErrors') || '{}');
    suppressedErrors[message] = {
      timestamp: Date.now(),
      duration: 2 * 60 * 60 * 1000 // 2 hours
    };
    localStorage.setItem('suppressedErrors', JSON.stringify(suppressedErrors));
  } catch (e) {
    console.error('Error handling timeout:', e);
  }
};

// Create a utility function for API calls with timeout
export const fetchWithTimeout = async (url, options = {}, timeoutMs = 15000) => {
  try {
    // Check if we're currently experiencing network issues
    const timeouts = JSON.parse(localStorage.getItem('timeouts') || '[]');
    const now = Date.now();
    
    // Count recent timeouts (last 5 minutes)
    const recentTimeouts = timeouts.filter(t => (now - t.timestamp) < 300000).length;
    
    // Adjust timeout based on recent timeout history
    if (recentTimeouts > 0) {
      timeoutMs = Math.min(timeoutMs * (1 + recentTimeouts), 60000); // Max 60 seconds
    }
    
    const controller = new AbortController();
    const { signal } = controller;
    
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.warn(`Request failed with status ${response.status}:`, data.error || url);
        return null; // Return null instead of throwing
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn('Fetch error suppressed:', error.message, url);
      return null; // Return null for all errors
    }
  } catch (e) {
    console.warn('Error in fetchWithTimeout:', e.message);
    return null; // Return null for all errors
  }
};

// Add a function to retry failed requests
export const fetchWithRetry = async (url, options = {}, maxRetries = 3, timeoutMs = 15000) => {
  try {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const result = await fetchWithTimeout(url, options, timeoutMs);
      if (result !== null) {
        return result;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // If all retries failed, return empty result based on expected response type
    console.warn(`All ${maxRetries} retry attempts failed for:`, url);
    return options.emptyFallback || null;
  } catch (e) {
    console.warn('Error in fetchWithRetry:', e.message);
    return options.emptyFallback || null;
  }
};

// Safe fetch wrapper that never throws errors
export const safeFetch = async (url, options = {}) => {
  try {
    const defaultOptions = {
      emptyFallback: Array.isArray(options.emptyFallback) ? [] : {},
      retries: 2,
      timeout: 15000
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return await fetchWithRetry(
      url, 
      mergedOptions, 
      mergedOptions.retries, 
      mergedOptions.timeout
    ) || mergedOptions.emptyFallback;
  } catch (e) {
    console.warn('Error in safeFetch:', e.message);
    return Array.isArray(options.emptyFallback) ? [] : {};
  }
};

// Export a function to check if an error is a timeout
export const isTimeoutError = (error) => {
  return error.name === 'AbortError' || 
         error.message.includes('timeout') || 
         error.message.includes('Timeout');
};


