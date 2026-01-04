import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiGift, FiCheck } from 'react-icons/fi';
import { registerUserPromo } from '../../../api/userApi';
import { cn } from '../../../utils/helpers';

const PromoBanner = ({ onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !mobileNumber.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Validate mobile number (10 digits)
    if (!/^\d{10}$/.test(mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await registerUserPromo(firstName, mobileNumber);
      if (response.status === 'success' && response.data?.promo_code) {
        setPromoCode(response.data.promo_code);
      } else {
        setPromoCode({ code: 'WELCOME10', discount_percent: 10 });
      }
    } catch (err) {
      console.error('Promo registration failed:', err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (promoCode?.code) {
      navigator.clipboard.writeText(promoCode.code);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-premium z-50 overflow-hidden"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-neutral-100 transition-colors z-10"
        aria-label="Close"
      >
        <FiX className="w-5 h-5 text-neutral-500" />
      </button>

      <AnimatePresence mode="wait">
        {promoCode ? (
          // Success state
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 text-center"
          >
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Your Promo Code
            </h3>
            <p className="text-neutral-600 text-sm mb-4">
              Use this code at checkout for {promoCode.discount_percent}% off!
            </p>
            <div className="bg-primary-50 border-2 border-dashed border-primary-200 rounded-xl p-4 mb-4">
              <p className="font-mono text-2xl font-bold text-primary-600">
                {promoCode.code}
              </p>
            </div>
            <button
              onClick={copyToClipboard}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Copy to clipboard
            </button>
          </motion.div>
        ) : (
          // Form state
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FiGift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Get 10% Off!</h3>
                  <p className="text-sm text-primary-100">On your first order</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-neutral-200 bg-neutral-50 text-neutral-500 text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Mobile Number"
                    className="flex-1 px-4 py-3 rounded-r-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-error-500 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full py-3 rounded-lg font-medium transition-colors',
                  'bg-primary-500 text-white hover:bg-primary-600',
                  isSubmitting && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isSubmitting ? 'Getting Code...' : 'Get My Discount Code'}
              </button>

              <p className="text-xs text-neutral-500 text-center">
                By signing up, you agree to receive promotional messages.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PromoBanner;
