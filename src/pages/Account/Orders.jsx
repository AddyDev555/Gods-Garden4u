import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiChevronRight, FiClock } from 'react-icons/fi';
import { FaTruck } from "react-icons/fa";
import { SITE_NAME } from '../../utils/constants';
import Button from '../../components/common/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import api from '../../api/gods-garden/axiosConfig';

const Orders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      // Wait for user object to be populated from AuthContext
      if (!user) return;

      // Check common variations of the ID field in case the structure differs
      const userId = user.id || user.user_id || user.pk || user.uid;

      if (!userId) {
        console.error('[Orders] User ID not found in user object:', user);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get('/get-all-orders/', {
          params: { user_id: userId }
        });
        setOrders(response.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [user, isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <>
      <Helmet>
        <title>{`My Orders | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container-custom">
          <h1 className="font-display text-3xl font-bold text-neutral-900 mb-8">My Orders</h1>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-soft animate-pulse flex gap-6">
                  <div className="w-32 h-32 bg-neutral-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-4 py-2">
                    <div className="h-5 bg-neutral-200 rounded w-3/4" />
                    <div className="h-3 bg-neutral-200 rounded w-1/2" />
                    <div className="h-3 bg-neutral-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.order_id} className="bg-white rounded-2xl shadow-soft overflow-hidden border border-neutral-100 hover:border-primary-200 transition-colors">
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                    {/* Image on the left (showing the primary item) */}
                    <div className="w-full sm:w-40 h-40 flex-shrink-0 bg-neutral-50 rounded-xl overflow-hidden border border-neutral-100">
                      <img
                        src={order.order_details[0]?.image}
                        alt={order.order_details[0]?.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details on the right */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-bold text-neutral-900 text-xl line-clamp-1">
                              {order.order_details[0]?.product_name}
                              {order.order_details.length > 1 && (
                                <span className="text-sm font-normal text-neutral-500 ml-2">
                                  + {order.order_details.length - 1} more items
                                </span>
                              )}
                            </h3>
                            <p className="text-xs font-mono font-medium text-neutral-400 mt-1 uppercase tracking-tight">
                              Order ID: <span className="text-neutral-600 font-bold">#{order.order_id.slice(0, 8)}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-neutral-500 mb-0.5">Total Amount</p>
                            <p className="font-bold text-primary-600 text-xl leading-none">{formatPrice(order.paid_amount)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-neutral-500 text-sm">
                          <FiClock className="w-4 h-4 text-primary-500" />
                          <span>Ordered on {new Date(order.created).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}</span>
                        </div>

                        {(() => {
                          const orderSteps = [
                            { key: "order-received", label: "Order Received" },
                            { key: "order-packed", label: "Order Packed" },
                            { key: "order-shipped", label: "Order Shipped" },
                            { key: "order-delivered", label: "Order Delivered" },
                          ];

                          const currentStepIndex = orderSteps.findIndex(
                            (step) => step.key === order.order_status
                          );

                          return (
                            <div className="pt-2">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <FiPackage className="w-4 h-4 text-primary-500" />
                                  <p className="text-sm text-neutral-500">
                                    Order Status
                                  </p>
                                </div>

                                <span className="text-xs font-bold text-primary-600 uppercase tracking-wide">
                                  {orderSteps[currentStepIndex]?.label || "Received"}
                                </span>
                              </div>

                              {/* Progress Bar */}
                              <div className="relative">
                                <div className="absolute top-2 left-0 w-full h-1 bg-neutral-200 rounded-full" />

                                <div
                                  className="absolute top-2 left-0 h-1 bg-primary-500 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${(currentStepIndex / (orderSteps.length - 1)) * 100}%`,
                                  }}
                                />

                                <div className="relative flex justify-between">
                                  {orderSteps.map((step, index) => {
                                    const isCompleted = index <= currentStepIndex;

                                    return (
                                      <div
                                        key={step.key}
                                        className="flex flex-col items-center text-center w-20"
                                      >
                                        <div
                                          className={`w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${isCompleted
                                              ? "bg-green-500"
                                              : "bg-neutral-200"
                                            }`}
                                        >
                                          {isCompleted && (
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                          )}
                                        </div>

                                        <span
                                          className={`mt-2 text-[11px] font-medium ${isCompleted
                                            ? "text-primary-600"
                                            : "text-neutral-400"
                                            }`}
                                        >
                                          {step.label}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        <div className="flex items-center gap-2 text-sm">
                          <FaTruck className="w-4 h-4 text-primary-500" />
                          <p className='text-neutral-500'>Order will be Delivered in <span className="font-bold text-primary-500">4 - 7 Days</span></p>
                        </div>

                      </div>

                      <div className="mt-4 pt-4 border-t border-neutral-50 flex justify-end">
                        <Link
                          to={`/account/orders/${order.order_id}`}
                          className="text-primary-600 font-bold text-sm flex items-center gap-1 hover:underline"
                        >
                          View Order Details <FiChevronRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-soft text-center border border-neutral-100">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage className="w-10 h-10 text-neutral-400" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">No orders yet</h2>
              <p className="text-neutral-600 mb-6">Start shopping to see your orders here</p>
              <Button as={Link} to="/shop">Start Shopping</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
