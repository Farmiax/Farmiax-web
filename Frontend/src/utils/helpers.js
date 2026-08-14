// Format currency in Indian Rupee
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format date with time
export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get order status color
export const getStatusColor = (status) => {
  const colors = {
    'Order Placed': '#1D4533',
    'Processing': '#d97706',
    'Shipped': '#2563eb',
    'Out for Delivery': '#7c3aed',
    'Delivered': '#16a34a',
    'Cancelled': '#dc2626',
  };
  return colors[status] || '#6b7280';
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Extract error message from API response
export const getApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
};

// Product quantity with unit display
export const formatQuantity = (quantity, unit) => {
  return `${quantity} ${unit}`;
};

// Indian states list for dropdowns
export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

// Product categories
export const productCategories = [
  'Spices', 'Pulses', 'Grains', 'Herbs', 'Oil & Ghee',
  'Vegetables', 'Fruits', 'Dairy', 'Honey', 'Dry Fruits', 'Other'
];

// Product units from backend enum
export const productUnits = ['g', 'kg', 'ml', 'L', 'pcs', 'pack'];

// Order status options from backend enum
export const orderStatuses = [
  'Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'
];
