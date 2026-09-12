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
  if (error.response?.data?.Message) {
    return error.response.data.Message;
  }
  if (error.message === 'Network Error') {
    return 'Unable to connect to the backend server. Please ensure your internet is connected or the server is active, and try again.';
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

// Resolves images safely across Cloudinary URLs, relative URLs, and local assets
export const getImageUrl = (imagePath, fallback = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80') => {
  if (!imagePath) return fallback;
  if (typeof imagePath !== 'string') return fallback;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:') || imagePath.startsWith('blob:')) {
    return imagePath;
  }
  const backendBase = (import.meta.env.VITE_API_BASE_URL || 'https://farmiax-web-backend.onrender.com/api/v1').replace(/\/api\/v1\/?$/, '');
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${backendBase}/${cleanPath}`;
};

// Format structured address object into readable string
export const formatAddress = (addr) => {
  if (!addr) return 'Address not provided';
  if (typeof addr === 'string') return addr;
  const parts = [
    addr.street || addr.address,
    addr.city || addr.City,
    addr.state || addr.State,
    addr.pincode || addr.PinCode,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Address not provided';
};
