/**
 * Centralized Constants & Configurations for Farmiax Frontend
 * Clean, modular constants for site categories, static content, and fallback options.
 */

import catSpices from '../assets/images/cat-spices.png';
import catPulses from '../assets/images/cat-pulses.png';
import catGrains from '../assets/images/cat-grains.png';
import catHerbs from '../assets/images/cat-herbs.png';
import catOilGhee from '../assets/images/cat-oil-ghee.png';
import catMore from '../assets/images/cat-more.png';
import ruralImg from '../assets/images/rural-india.png';

export const PRODUCT_CATEGORIES = [
  { name: 'Spices', subtitle: 'Authentic & Pure', image: catSpices, count: 18 },
  { name: 'Pulses', subtitle: 'High in Protein', image: catPulses, count: 12 },
  { name: 'Grains', subtitle: 'Premium Quality', image: catGrains, count: 15 },
  { name: 'Herbs', subtitle: 'Natural & Healthy', image: catHerbs, count: 8 },
  { name: 'Oil & Ghee', subtitle: 'Pure & Traditional', image: catOilGhee, count: 10 },
  { name: 'More', subtitle: 'Explore All', image: catMore, count: 20 },
];

export const FEATURED_FARMERS = [
  { id: 'f1', name: 'Ramesh Kumar', location: 'Karnataka, Turmeric Farmer', rating: 4.9, reviews: 84, image: ruralImg },
  { id: 'f2', name: 'Sita Devi', location: 'Rajasthan, Pulses Farmer', rating: 4.9, reviews: 62, image: ruralImg },
  { id: 'f3', name: 'Mohan Singh', location: 'Punjab, Grain Farmer', rating: 4.8, reviews: 94, image: ruralImg },
  { id: 'f4', name: 'Lakshmi Narayan', location: 'Tamil Nadu, Spice Farmer', rating: 4.7, reviews: 45, image: ruralImg },
];

export const CUSTOMER_TESTIMONIALS = [
  {
    id: 't1',
    initials: 'PS',
    name: 'Priya S.',
    role: 'Customer since 2023',
    stars: 5,
    text: '"The quality of spices is amazing! Pure and authentic taste. My cooking has never been better. Thank you Farmiax!"',
  },
  {
    id: 't2',
    initials: 'AM',
    name: 'Arjun M.',
    role: 'Verified Buyer',
    stars: 5,
    text: '"On-time delivery and great packaging. Highly recommended for anyone looking for authentic pulses and grains."',
  },
  {
    id: 't3',
    initials: 'NR',
    name: 'Neha R.',
    role: 'Sustainability Advocate',
    stars: 5,
    text: '"Finally found a platform that truly supports farmers. Happy to be a part of it and getting premium quality at the same time."',
  },
];

export const ORDER_STATUS_FILTERS = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
