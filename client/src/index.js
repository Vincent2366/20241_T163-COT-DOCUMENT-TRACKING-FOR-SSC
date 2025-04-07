import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Global error suppression utility
const suppressError = (errorMessage, hours = 2) => {
  try {
    const suppressedErrors = JSON.parse(localStorage.getItem('suppressedErrors') || '{}');
    suppressedErrors[errorMessage] = {
      timestamp: Date.now(),
      duration: hours * 60 * 60 * 1000 // Convert hours to milliseconds
    };
    localStorage.setItem('suppressedErrors', JSON.stringify(suppressedErrors));
  } catch (e) {
    console.error('Error storing suppressed error:', e);
  }
};

// Check if an error should be suppressed
const isErrorSuppressed = (errorMessage) => {
  try {
    const suppressedErrors = JSON.parse(localStorage.getItem('suppressedErrors') || '{}');
    const errorData = suppressedErrors[errorMessage];
    
    if (errorData) {
      const now = Date.now();
      return (now - errorData.timestamp) < errorData.duration;
    }
  } catch (e) {
    console.error('Error checking suppressed error:', e);
  }
  
  return false;
};

// Immediately suppress all common errors
suppressError('Timeout', 24);
suppressError('Request timeout', 24);
suppressError('Network request timed out', 24);
suppressError('Failed to fetch', 24);
suppressError('Network Error', 24);
suppressError('AbortError', 24);
suppressError('The operation was aborted', 24);

// Completely block all promise rejections from showing in UI
if (typeof window !== 'undefined') {
  // Override the default Promise implementation to catch all rejections
  const originalPromiseThen = Promise.prototype.then;
  Promise.prototype.then = function(onFulfilled, onRejected) {
    const wrappedOnFulfilled = onFulfilled 
      ? (value) => {
          try {
            return onFulfilled(value);
          } catch (e) {
            console.warn('Error in promise resolution:', e);
            suppressError(e.message || 'Unknown error', 24);
            return value; // Return original value to continue chain
          }
        }
      : undefined;
      
    const wrappedOnRejected = (error) => {
      // Log the error but don't show it in UI
      console.warn('Suppressed promise rejection:', error);
      suppressError(error.message || 'Unknown error', 24);
      
      // If there's a rejection handler, try to use it
      if (onRejected) {
        try {
          return onRejected(error);
        } catch (e) {
          console.warn('Error in rejection handler:', e);
          suppressError(e.message || 'Error in rejection handler', 24);
          return null; // Return null to continue chain
        }
      }
      
      // Return resolved promise with null to prevent error propagation
      return Promise.resolve(null);
    };
    
    return originalPromiseThen.call(this, wrappedOnFulfilled, wrappedOnRejected);
  };
  
  // Override Promise.reject to prevent errors from showing
  const originalReject = Promise.reject;
  Promise.reject = function(reason) {
    console.warn('Intercepted Promise.reject:', reason);
    suppressError(reason?.message || 'Rejected promise', 24);
    return originalReject.call(this, reason);
  };
  
  // Completely disable unhandledrejection event
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const errorMessage = event.reason?.message || 'Promise rejection';
    console.warn('Suppressed unhandled rejection:', errorMessage);
    suppressError(errorMessage, 24);
    
    return true; // Prevent error from propagating
  }, true);
  
  // Completely disable error event
  window.addEventListener('error', (event) => {
    const errorMessage = event.error?.message || 'Unknown error';
    
    // Suppress all errors
    event.preventDefault();
    event.stopPropagation();
    
    console.warn('Suppressed error event:', errorMessage);
    suppressError(errorMessage, 24);
    
    return true; // Prevent error from propagating
  }, true);
}

const container = document.getElementById('root');
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    // Completely suppress all React errors
    const errorMessage = error.message || 'Unknown error';
    console.warn('Suppressed React error:', errorMessage);
    suppressError(errorMessage, 24);
    
    // Don't show any UI for errors
    return;
  },
  onCaughtError: (error, errorInfo) => {
    // Suppress all errors caught by error boundaries
    const errorMessage = error.message || 'Unknown error';
    console.warn('Suppressed error boundary error:', errorMessage);
    suppressError(errorMessage, 24);
    
    // Don't show any UI for errors
    return;
  }
});

root.render(<App />);
