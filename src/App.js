import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Scroller from './components/common/Scroller';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import ScrollToTop from './components/ui/ScrollToTop';
import PageLoader from './components/common/PageLoader';
import Toast from './components/common/Toast/Toast';

// Lazy load pages for code splitting
const Home = lazy(() => import(/* webpackChunkName: "home" */ './pages/Home/Home'));
const Shop = lazy(() => import(/* webpackChunkName: "shop" */ './pages/Shop/Shop'));
const Category = lazy(() => import(/* webpackChunkName: "category" */ './pages/Category/Category'));
const Product = lazy(() => import(/* webpackChunkName: "product" */ './pages/Product/Product'));
const Cart = lazy(() => import(/* webpackChunkName: "cart" */ './pages/Cart/Cart'));
const Checkout = lazy(() => import(/* webpackChunkName: "checkout" */ './pages/Checkout/Checkout'));
const CheckoutSuccess = lazy(() => import(/* webpackChunkName: "checkout" */ './pages/Checkout/CheckoutSuccess'));
const Login = lazy(() => import(/* webpackChunkName: "auth" */ './pages/Auth/Login'));
const Register = lazy(() => import(/* webpackChunkName: "auth" */ './pages/Auth/Register'));
const ForgotPassword = lazy(() => import(/* webpackChunkName: "auth" */ './pages/Auth/ForgotPassword'));
const Account = lazy(() => import(/* webpackChunkName: "account" */ './pages/Account/Account'));
const Orders = lazy(() => import(/* webpackChunkName: "account" */ './pages/Account/Orders'));
const OrderDetail = lazy(() => import(/* webpackChunkName: "account" */ './pages/Account/OrderDetail'));
const Addresses = lazy(() => import(/* webpackChunkName: "account" */ './pages/Account/Addresses'));
const Wishlist = lazy(() => import(/* webpackChunkName: "wishlist" */ './pages/Wishlist/Wishlist'));
const Search = lazy(() => import(/* webpackChunkName: "search" */ './pages/Search/Search'));
const BlogList = lazy(() => import(/* webpackChunkName: "blog" */ './pages/Blog/BlogList'));
const BlogDetail = lazy(() => import(/* webpackChunkName: "blog" */ './pages/Blog/BlogDetail'));
const AboutUs = lazy(() => import(/* webpackChunkName: "static" */ './pages/Static/AboutUs'));
const ContactUs = lazy(() => import(/* webpackChunkName: "static" */ './pages/Static/ContactUs'));
const Privacy = lazy(() => import(/* webpackChunkName: "policies" */ './pages/Static/Privacy'));
const Terms = lazy(() => import(/* webpackChunkName: "policies" */ './pages/Static/Terms'));
const Shipping = lazy(() => import(/* webpackChunkName: "policies" */ './pages/Static/Shipping'));
const Returns = lazy(() => import(/* webpackChunkName: "policies" */ './pages/Static/Returns'));
const Cancellation = lazy(() => import(/* webpackChunkName: "policies" */ './pages/Static/Cancellation'));
const CookiePolicy = lazy(() => import(/* webpackChunkName: "policies" */ './pages/Static/CookiePolicy'));
const FAQ = lazy(() => import(/* webpackChunkName: "static" */ './pages/Static/FAQ'));
const TrackOrder = lazy(() => import(/* webpackChunkName: "static" */ './pages/TrackOrder/TrackOrder'));
const NotFound = lazy(() => import(/* webpackChunkName: "notfound" */ './pages/NotFound/NotFound'));

function App() {
  return (
    <div className="flex flex-col min-h-screen pt-[96px] lg:pt-[112px]">
      {/* Promotional Scroller */}
      <Scroller />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/category/:slug" element={<Category />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/search" element={<Search />} />
            <Route path="/wishlist" element={<Wishlist />} />

            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Account Pages */}
            <Route path="/account" element={<Account />} />
            <Route path="/account/orders" element={<Orders />} />
            <Route path="/account/orders/:id" element={<OrderDetail />} />
            <Route path="/account/addresses" element={<Addresses />} />

            {/* Blog */}
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />

            {/* Static Pages */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/faq" element={<FAQ />} />

            {/* Policy Pages */}
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/cancellation" element={<Cancellation />} />
            <Route path="/cookies" element={<CookiePolicy />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />

      {/* Utilities */}
      <ScrollToTop />
      <Toast />
    </div>
  );
}

export default App;
