export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  return '';
};

export const validatePinCode = (pinCode) => {
  const re = /^\d{6}$/;
  return re.test(pinCode);
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return '';
};

// Validate entire registration form
export const validateRegistrationForm = (formData, isfarmer = false) => {
  const errors = {};

  const nameErr = validateRequired(formData.fullName, 'Full Name');
  if (nameErr) errors.fullName = nameErr;

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.phone) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid 10-digit phone number';
  }

  const passErr = validatePassword(formData.password);
  if (passErr) errors.password = passErr;

  const confirmErr = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (confirmErr) errors.confirmPassword = confirmErr;

  const addressErr = validateRequired(formData.address, 'Address');
  if (addressErr) errors.address = addressErr;

  if (!formData.PinCode) {
    errors.PinCode = 'Pin code is required';
  } else if (!validatePinCode(formData.PinCode)) {
    errors.PinCode = 'Please enter a valid 6-digit pin code';
  }

  const cityErr = validateRequired(formData.City, 'City');
  if (cityErr) errors.City = cityErr;

  const stateErr = validateRequired(formData.State, 'State');
  if (stateErr) errors.State = stateErr;

  return errors;
};

// Validate login form
export const validateLoginForm = (email, password) => {
  const errors = {};
  if (!email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }
  if (!password) {
    errors.password = 'Password is required';
  }
  return errors;
};
