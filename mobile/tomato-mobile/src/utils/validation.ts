export const validation = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword: (password: string): boolean => {
    // At least 6 characters
    return password.length >= 6;
  },

  isValidUsername: (username: string): boolean => {
    // At least 3 characters, alphanumeric and underscore
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    return usernameRegex.test(username);
  },

  isNotEmpty: (value: string): boolean => {
    return value.trim().length > 0;
  },
};
