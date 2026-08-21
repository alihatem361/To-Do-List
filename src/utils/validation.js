export const validateSignUp = ({ fullName, email, password, confirmPassword }) => {
  const errors = {};

  if (!fullName || fullName.trim().length === 0) {
    errors.fullName = 'Full name is required';
  } else if (fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  if (!email || email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!password || password.length === 0) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!confirmPassword || confirmPassword.length === 0) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!email || email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!password || password.length === 0) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const validateTask = ({ title, description }) => {
  const errors = {};

  if (!title || title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (title.trim().length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  if (description && description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  return errors;
};
