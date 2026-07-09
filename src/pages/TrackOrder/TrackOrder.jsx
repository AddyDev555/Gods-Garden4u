import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FiPackage, FiSearch } from 'react-icons/fi';
import { SITE_NAME, DEFAULT_PRODUCT_IMAGE } from '../../utils/constants';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/gods-garden/axiosConfig';
import { getOrderItemImage } from '../../utils/helpers';

const TrackOrder = () => {
  const { user, isAuthenticated } = useAuth();
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId.trim()) {
      setOrder(null);
      setError('');
    }
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedOrderId = orderId.trim();
    if (!trimmedOrderId) {
      setError('Please enter your order ID');
      return;
    }

    if (!isAuthenticated || !user) {
      setError('Please log in to track your order');
      return;
    }

    const userId = user.id || user.user_id || user.pk || user.uid;
    if (!userId) {
      setError('Unable to identify your account');
      return;
    }

    setIsLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await api.get('/get-all-orders/', {
        params: {
          user_id: userId,
          order_id: trimmedOrderId,
        },
      });

      const orders = response.data?.data || [];
      const foundOrder = orders.find((item) => item.order_id?.toString() === trimmedOrderId);

      if (!foundOrder) {
        setError('We could not find an order with that ID.');
        return;
      }

      setOrder(foundOrder);
    } catch (err) {
      console.error('Track order lookup failed:', err);
      setError('Unable to load your order right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const orderItems = Array.isArray(order?.order_details) ? order.order_details : [];

  return (
    <>
      <Helmet>
        <title>{`Track Order | ${SITE_NAME}`}</title>
        <meta name="description" content={`Track your ${SITE_NAME} order. Enter your order ID to check delivery status.`} />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-12">
        <div className="container-custom max-w-lg">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2">
              Track Your Order
            </h1>
            <p className="text-neutral-600">
              Enter your order ID to check delivery status
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-soft">
            <Input
              label="Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your order ID"
              leftIcon={<FiSearch />}
              className="mb-4"
            />

            <Button type="submit" fullWidth size="lg" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Track Order'}
            </Button>

            {error ? (
              <p className="text-sm text-error-600 text-center mt-4">{error}</p>
            ) : (
              <p className="text-sm text-neutral-500 text-center mt-4">
                You can find your order ID in the confirmation email we sent you.
              </p>
            )}
          </form>

          {order && (
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-soft">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-neutral-500">Order ID</p>
                  <p className="font-semibold text-neutral-900">#{order.order_id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-500">Status</p>
                  <p className="font-semibold text-primary-600">{order.order_status || 'Processing'}</p>
                </div>
              </div>

              <div className="space-y-3">
                {orderItems.length > 0 ? (
                  orderItems.map((item, index) => {
                    const itemName = item.product_name || item.name || item.title || 'Product';
                    const quantity = item.quantity || item.qty || 1;
                    const image = getOrderItemImage(item);

                    return (
                      <div key={`${itemName}-${index}`} className="flex items-center gap-3 rounded-xl border border-neutral-100 p-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                          <img
                            src={image || DEFAULT_PRODUCT_IMAGE}
                            alt={itemName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-neutral-900 truncate">{itemName}</p>
                          <p className="text-sm text-neutral-500">Qty: {quantity}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-neutral-500">No items found for this order.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrackOrder;
