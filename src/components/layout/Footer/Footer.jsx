import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { SITE_NAME, FOOTER_LINKS, SOCIAL_LINKS, CONTACT_INFO } from '../../../utils/constants';
import CurrencySelector from '../../ui/CurrencySelector';
import { cn } from '../../../utils/helpers';
import { subscribeNewsletter } from '../../../api/gods-garden/userApi';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await subscribeNewsletter(email);
      setMessage({ type: 'success', text: 'Thank you for subscribing!' });
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to subscribe. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  const socialIcons = {
    facebook: FiFacebook,
    instagram: FiInstagram,
    twitter: FiTwitter,
    youtube: FiYoutube,
  };

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🌿</span>
              <span className="font-display font-semibold text-2xl text-primary-400">
                {SITE_NAME}
              </span>
            </Link>
            <p className="text-neutral-400 mb-6 max-w-sm">
              Premium organic food and spices, sourced directly from farms.
              Experience the authentic taste of nature with our handpicked selection.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors"
              >
                <FiMail className="w-4 h-4 flex-shrink-0" />
                {CONTACT_INFO.email}
              </a>
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors"
              >
                <FiPhone className="w-4 h-4 flex-shrink-0" />
                {CONTACT_INFO.phone}
              </a>
              <p className="flex items-center gap-3 text-neutral-400">
                <FiMapPin className="w-4 h-4 flex-shrink-0" />
                {CONTACT_INFO.address}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = socialIcons[social.icon] || FiFacebook;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-primary-500 hover:text-white transition-all"
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-neutral-400 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full py-3 rounded-lg font-medium transition-colors',
                  'bg-primary-500 text-white hover:bg-primary-600',
                  isSubmitting && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
              {message.text && (
                <p
                  className={cn(
                    'text-sm',
                    message.type === 'success' ? 'text-primary-400' : 'text-error-400'
                  )}
                >
                  {message.text}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-neutral-500 text-sm text-center md:text-left">
              &copy; {currentYear} {SITE_NAME}. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              {FOOTER_LINKS.legal.map((link, index) => (
                <React.Fragment key={link.path}>
                  <Link
                    to={link.path}
                    className="text-neutral-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                  {index < FOOTER_LINKS.legal.length - 1 && (
                    <span className="text-neutral-700">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Currency */}
            <div className="hidden md:block">
              <CurrencySelector variant="dark" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Trust Badges */}
      <div className="border-t border-neutral-800 bg-neutral-950">
        <div className="container-custom py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-neutral-500 text-xs">
            <span>Secure Checkout</span>
            <span>•</span>
            <span>100% Authentic Products</span>
            <span>•</span>
            <span>Easy Returns</span>
            <span>•</span>
            <span>Worldwide Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
