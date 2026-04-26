import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiMenu, FiX } from 'react-icons/fi';
import { useShop } from '../../../context/ShopContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';
import CurrencySelector from '../../ui/CurrencySelector';
import { cn } from '../../../utils/helpers';
import { NAV_LINKS, SITE_NAME } from '../../../utils/constants';

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount } = useShop();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-10 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-soft'
            : 'bg-white'
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <img
                src="/images/hero/godsgardenlogo.webp"
                alt="Gods Garden"
                className="h-10 w-10 object-contain rounded-full"
              />
              <span className="font-display font-semibold text-xl text-primary-600">
                {SITE_NAME}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      'text-sm font-medium transition-colors duration-200',
                      isActive
                        ? 'text-primary-600'
                        : 'text-neutral-600 hover:text-primary-500'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Currency Selector - Desktop */}
              <div className="hidden md:block">
                <CurrencySelector variant="minimal" />
              </div>

              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5 text-neutral-600" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2.5 rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Wishlist"
              >
                <FiHeart className="w-5 h-5 text-neutral-600" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Cart"
              >
                <FiShoppingCart className="w-5 h-5 text-neutral-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="hidden sm:flex items-center gap-2 p-2.5 rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Account"
              >
                <FiUser className="w-5 h-5 text-neutral-600" />
                {isAuthenticated && user?.first_name && (
                  <span className="hidden md:inline text-sm font-medium text-neutral-600">
                    {user.first_name}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <FiX className="w-5 h-5 text-neutral-600" />
                ) : (
                  <FiMenu className="w-5 h-5 text-neutral-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>


      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-white shadow-premium"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="container-custom py-4">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-12 py-4 text-lg border-0 bg-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-neutral-200"
                  >
                    <FiX className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-premium"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                  <span className="font-display font-semibold text-lg text-primary-600">
                    Menu
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-neutral-100"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                  {NAV_LINKS.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'block px-6 py-3 text-base font-medium transition-colors',
                          isActive
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}

                  <hr className="my-4 border-neutral-200" />

                  <Link
                    to={isAuthenticated ? '/account' : '/login'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-6 py-3 text-base font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    <FiUser className="w-5 h-5" />
                    {isAuthenticated ? 'My Account' : 'Login / Register'}
                  </Link>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-neutral-200">
                  <CurrencySelector variant="default" className="w-full" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
