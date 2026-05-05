import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiCheck, FiPackage, FiMail } from 'react-icons/fi';
import { SITE_NAME } from '../../utils/constants';
import Button from '../../components/common/Button/Button';
import api from '../../api/gods-garden/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { formatDate } from '../../utils/helpers';

const CheckoutSuccess = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const routeOrderId = location.state?.orderId;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!routeOrderId || !user) return;

      const userId = user.id || user.user_id || user.pk || user.uid;
      if (!userId) {
        setError('Unable to load order details.');
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get('/get-all-orders/', {
          params: {
            user_id: userId,
            order_id: routeOrderId,
          },
        });

        const orders = response.data?.data || [];
        const foundOrder = orders.find((item) => item.order_id?.toString() === routeOrderId?.toString());

        if (foundOrder) {
          setOrder(foundOrder);
        } else if (orders.length === 1) {
          setOrder(orders[0]);
        } else {
          setError('Order information could not be located.');
        }
      } catch (err) {
        console.error('CheckoutSuccess order fetch failed:', err);
        setError('Failed to load exact order details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [routeOrderId, user]);

  const orderItems = order?.order_details || order?.order_items || order?.items || [];
  const subtotal = order?.sub_total || order?.subtotal || order?.cart_total || 0;
  const shippingAmount = order?.shipping_amount || order?.shipping_charge || order?.shipping_cost || 0;
  const discountAmount = order?.discount_amount || order?.discount || 0;
  const totalAmount = order?.total_amount || order?.order_total || subtotal + shippingAmount - discountAmount;

  return (
    <>
      <Helmet>
        <title>{`Order Confirmed | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center bg-neutral-50 py-16">
        <div className="container-custom max-w-3xl text-center">
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

          {routeOrderId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 mb-8 shadow-soft"
            >
              <p className="text-sm text-neutral-500 mb-2">Order ID</p>
              <p className="font-mono font-medium text-neutral-900">{routeOrderId}</p>
            </motion.div>
          )}

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 mb-8 shadow-soft"
            >
              <p className="text-neutral-500">Loading exact order details...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 mb-8 shadow-soft border border-error-200 text-error-700"
            >
              <p>{error}</p>
            </motion.div>
          ) : order ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-6 mb-8 shadow-soft border border-neutral-100"
            >
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Order summary</h2>
              <div className="space-y-4 text-left text-sm text-neutral-600">
                {orderItems.length > 0 && (
                  <div className="space-y-3">
                    {orderItems.map((item, index) => {
                      const itemName = item.product_name || item.name || item.title || 'Product';
                      const quantity = item.quantity || item.qty || 1;
                      const itemPrice = item.price || item.unit_price || item.offer_price || 0;
                      const linePrice = item.total_price || item.total || itemPrice * quantity;
                      const size = item.size || item.order_size || item.variant || '';

                      return (
                        <div key={`${itemName}-${index}`} className="flex justify-between gap-4">
                          <div>
                            <p className="font-medium text-neutral-900">{itemName}</p>
                            <p className="text-xs text-neutral-500">
                              {size ? `${size} · ` : ''}Qty {quantity}
                            </p>
                          </div>
                          <p className="font-medium text-neutral-900">{formatPrice(linePrice)}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="border-t border-neutral-100 pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{formatPrice(shippingAmount)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Discount</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold mt-4">
                    <span>Total paid</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}

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
