# God's Garden

Premium SEO-optimized eCommerce website for organic food and spices.

## Tech Stack

- **Frontend**: React 18.2.0, Tailwind CSS 3.4
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **SEO**: React Helmet + JSON-LD Structured Data
- **State**: Context API (Currency, Shop, Wishlist, Auth)
- **Payments**: Razorpay
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file:

```env
REACT_APP_API_BASE_URL=https://jaipurmasale-backend.onrender.com/api
REACT_APP_EXCHANGE_RATE=83
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
REACT_APP_SITE_URL=https://godsgarden.com
REACT_APP_SITE_NAME=God's Garden
```

## Project Structure

```
src/
├── api/              # Axios configuration
├── context/          # React contexts
│   ├── CurrencyContext.jsx
│   ├── ShopContext.jsx
│   ├── WishlistContext.jsx
│   └── AuthContext.jsx
├── components/
│   ├── common/       # Button, Badge, Input, Modal, etc.
│   ├── layout/       # Navbar, Footer
│   ├── product/      # ProductCard
│   └── ui/           # CurrencySelector, ScrollToTop
├── pages/            # All page components
└── utils/            # Helpers, constants, SEO
```

## Features

- Multi-currency support (INR/USD with auto-detection)
- SEO optimized with meta tags and structured data
- Responsive design with premium UI
- Shopping cart with promo codes
- Razorpay payment integration
- Wishlist functionality
- Order tracking
- Blog section

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/shop` | Product listing |
| `/category/:slug` | Category page |
| `/product/:slug` | Product detail |
| `/cart` | Shopping cart |
| `/checkout` | Checkout with Razorpay |
| `/login` | Login page |
| `/register` | Registration |
| `/account` | User dashboard |
| `/account/orders` | Order history |
| `/wishlist` | Wishlist |
| `/blog` | Blog listing |
| `/blog/:slug` | Blog article |
| `/about` | About us |
| `/contact` | Contact form |
| `/faq` | FAQ page |
| `/track-order` | Order tracking |

## Deployment

Configured for Vercel with `vercel.json` for SPA routing and security headers.

```bash
# Deploy to Vercel
vercel --prod
```
