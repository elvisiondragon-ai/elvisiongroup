// Input validation and sanitization utilities
export const sanitizeInput = (input: string, maxLength: number = 255): string => {
  if (!input) return '';
  
  // Remove HTML tags
  const withoutHtml = input.replace(/<[^>]*>?/gm, '');
  
  // Remove potentially dangerous characters
  const sanitized = withoutHtml.replace(/[<>'"&]/g, '');
  
  // Trim whitespace and limit length
  return sanitized.trim().substring(0, maxLength);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizePaymentAmount = (amount: string): number => {
  // Remove all non-numeric characters except decimal point
  const cleaned = amount.replace(/[^0-9.]/g, '');
  
  // Parse as float and validate
  const parsed = parseFloat(cleaned);
  
  // Ensure it's a valid positive number with max 2 decimal places
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error('Invalid payment amount');
  }
  
  // Round to 2 decimal places
  return Math.round(parsed * 100) / 100;
};

export const validateBankAccount = (accountNumber: string): boolean => {
  // Remove spaces and dashes
  const cleaned = accountNumber.replace(/[-\s]/g, '');
  
  // Check if it's numeric and has reasonable length (6-20 digits)
  return /^\d{6,20}$/.test(cleaned);
};

export const rateLimitChecker = (() => {
  const attempts: { [key: string]: number[] } = {};
  
  return (key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Initialize or filter old attempts
    if (!attempts[key]) {
      attempts[key] = [];
    }
    
    attempts[key] = attempts[key].filter(timestamp => timestamp > windowStart);
    
    // Check if limit exceeded
    if (attempts[key].length >= maxAttempts) {
      return false;
    }
    
    // Add current attempt
    attempts[key].push(now);
    return true;
  };
})();