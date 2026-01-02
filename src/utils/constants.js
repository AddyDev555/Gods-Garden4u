// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://jaipurmasale-backend.onrender.com/api';

// Site Configuration
export const SITE_NAME = process.env.REACT_APP_SITE_NAME || "God's Garden";
export const SITE_URL = process.env.REACT_APP_SITE_URL || 'https://godsgarden.com';
export const SITE_DESCRIPTION = 'Premium Organic Food & Spices - Shop authentic organic masalas, dry fruits, seeds and more.';

// Currency Configuration
export const DEFAULT_CURRENCY = 'INR';
export const EXCHANGE_RATE = parseFloat(process.env.REACT_APP_EXCHANGE_RATE) || 83;
export const CURRENCIES = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    locale: 'en-IN',
    country: 'India',
    flag: '🇮🇳',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    country: 'International',
    flag: '🌍',
  },
};

// Payment Configuration
export const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || '';

// Shipping Configuration
export const FREE_SHIPPING_THRESHOLD_INR = 499;
export const SHIPPING_FEE_INR = 39;
export const COD_FEE_INR = 0;

// Product Configuration
export const PRODUCTS_PER_PAGE = 12;
export const DEFAULT_PRODUCT_IMAGE = '/images/placeholder-product.webp';

// Size Options (from backend)
export const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
export const SIZE_LABELS = {
  S: '100gm',
  M: '250gm',
  L: '500gm',
  XL: '1Kg',
  XXL: '2Kg',
  XXXL: '5Kg',
};

// Rating Options
export const RATING_OPTIONS = [1, 2, 3, 4, 5];

// Sort Options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
];

// Navigation Links
export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'About', path: '/about' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

// Footer Links
export const FOOTER_LINKS = {
  shop: [
    { label: 'All Products', path: '/shop' },
    { label: 'Best Sellers', path: '/shop?sort=popular' },
    { label: 'New Arrivals', path: '/shop?filter=new' },
    { label: 'Gift Packs', path: '/category/gift-packs' },
  ],
  support: [
    { label: 'Contact Us', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Track Order', path: '/track-order' },
    { label: 'Shipping Info', path: '/shipping' },
  ],
  company: [
    { label: 'About Us', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Careers', path: '/careers' },
  ],
  legal: [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Return Policy', path: '/returns' },
    { label: 'Cookie Policy', path: '/cookies' },
  ],
};

// Social Links
export const SOCIAL_LINKS = [
  { name: 'Facebook', url: 'https://facebook.com/godsgarden', icon: 'facebook' },
  { name: 'Instagram', url: 'https://instagram.com/godsgarden', icon: 'instagram' },
  { name: 'Twitter', url: 'https://twitter.com/godsgarden', icon: 'twitter' },
  { name: 'YouTube', url: 'https://youtube.com/godsgarden', icon: 'youtube' },
];

// Contact Info
export const CONTACT_INFO = {
  email: 'support@godsgarden.com',
  phone: '+91 9876543210',
  whatsapp: '+919876543210',
  address: 'Jaipur, Rajasthan, India',
};

// Toast Configuration
export const TOAST_DURATION = 3000;

// Local Storage Keys
export const STORAGE_KEYS = {
  CURRENCY: 'gods_garden_currency',
  CART_ID: 'gods_garden_cart_id',
  AUTH_TOKEN: 'gods_garden_token',
  WISHLIST: 'gods_garden_wishlist',
  USER: 'gods_garden_user',
};

// Cache Configuration
export const CACHE_DURATION = {
  CART: 5 * 60 * 1000, // 5 minutes
  PRODUCTS: 10 * 60 * 1000, // 10 minutes
  CATEGORIES: 60 * 60 * 1000, // 1 hour
};

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Animation Variants for Framer Motion
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  slideInRight: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  },
  slideInLeft: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};
