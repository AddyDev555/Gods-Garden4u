import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiCheck, FiPackage, FiMail } from 'react-icons/fi';
import { SITE_NAME } from '../../utils/constants';
import Button from '../../components/common/Button/Button';

const CheckoutSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <>
      <Helmet>
        <title>Order Confirmed | {SITE_NAME}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center bg-neutral-50 py-16">
        <div className="container-custom max-w-lg text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-6 bg-primary-500 rounded-full flex items-center justify-center"
          >
            <FiCheck className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-3xl font-bold text-neutral-900 mb-4"
          >
            Order Confirmed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-neutral-600 mb-8"
          >
            Thank you for your order. We'll send you a confirmation email with your order details.
          </motion.p>

          {orderId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 mb-8 shadow-soft"
            >
              <p className="text-sm text-neutral-500 mb-2">Order ID</p>
              <p className="font-mono font-medium text-neutral-900">{orderId}</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid sm:grid-cols-2 gap-4 mb-8"
          >
            <div className="bg-white rounded-xl p-4 shadow-soft flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <FiMail className="w-5 h-5 text-primary-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Confirmation Email</p>
                <p className="text-xs text-neutral-500">Check your inbox</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-soft flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <FiPackage className="w-5 h-5 text-primary-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Shipping Soon</p>
                <p className="text-xs text-neutral-500">2-5 business days</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button as={Link} to="/shop" size="lg">
              Continue Shopping
            </Button>
            <Button as={Link} to="/track-order" variant="outline" size="lg">
              Track Order
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CheckoutSuccess;
