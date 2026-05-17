import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FiChevronLeft, FiClock, FiPackage, FiMapPin } from 'react-icons/fi';
import { SITE_NAME } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import api from '../../api/gods-garden/axiosConfig';
import { formatDate } from '../../utils/helpers';
import Button from '../../components/common/Button/Button';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) return;

      const userId = user.id || user.user_id || user.pk || user.uid;
      if (!userId) {
        console.error('[OrderDetail] User ID not found:', user);
        setError('Unable to load order details. Please try again.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get('/get-all-orders/', {
          params: {
            user_id: userId,
            order_id: id,
          },
        });

        const orders = response.data?.data || [];
        const foundOrder = orders.find((item) => {
          const orderId = item.order_id || item.id || item.orderId || item.order_id;
          return orderId?.toString() === id?.toString();
        });

        if (!foundOrder) {
          setError('Order not found.');
          setOrder(null);
        } else {
          setOrder(foundOrder);
        }
      } catch (err) {
        console.error('[OrderDetail] Failed to fetch order:', err);
        setError('Failed to load order details. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrder();
    }
  }, [user, isAuthenticated, id]);

  const rawOrderDetails = order?.order_details;
  const orderItems = useMemo(() => {
    if (!rawOrderDetails) return [];
    if (typeof rawOrderDetails === 'string') {
      try {
        return JSON.parse(rawOrderDetails);
      } catch {
        return [];
      }
    }
    return Array.isArray(rawOrderDetails) ? rawOrderDetails : [];
  }, [rawOrderDetails]);

  const itemCount = orderItems.length;
  const status = order?.order_status || 'Processing';
  const shippingAddress = order?.delivery_address || order?.shipping_address || order?.address || '';
  const contactNumber = order?.mobile_number || order?.phone || order?.contact_number || '';
  const subtotal = order?.total_amount;
  const shippingAmount =
    subtotal >= 499
      ? 0
      : subtotal >= 300
        ? 50
        : subtotal >= 100
          ? 60
          : 0;
  const discountAmount = order?.discount_amount || order?.discount || 0;
  const totalAmount = order?.paid_amount;
  const createdAt = order?.created || order?.created_at || order?.ordered_at || order?.order_date;

  return (
    <>
      <Helmet>
        <title>{`Order #${id} | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-neutral-900">Order #{id}</h1>
              <p className="text-sm text-neutral-500 mt-2">
                {createdAt ? `Placed on ${formatDate(createdAt)}` : 'Order date unavailable'}
              </p>
            </div>
            <Button as={Link} to="/account/orders" variant="outline" size="sm" className="inline-flex items-center gap-2">
              <FiChevronLeft /> Back to Orders
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-soft border border-neutral-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    {(() => {
                      const orderSteps = [
                        { key: "order-received", label: "Order Received" },
                        { key: "order-packed", label: "Order Packed" },
                        { key: "order-shipped", label: "Order Shipped" },
                        { key: "order-delivered", label: "Order Delivered" },
                      ];

                      const currentStepIndex = orderSteps.findIndex(
                        (step) => step.key === order?.order_status
                      );

                      return (
                        <div className="w-full">
                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 mb-5">
                            Order Status
                          </p>

                          {/* Desktop Progress */}
                          <div className="hidden md:block">
                            <div className="relative">
                              {/* Background Line */}
                              <div className="absolute top-5 left-0 w-full h-1 bg-neutral-200 rounded-full" />

                              {/* Active Line */}
                              <div
                                className={`absolute top-5 left-0 h-1 rounded-full transition-all duration-700 ${currentStepIndex === orderSteps.length - 1
                                    ? "bg-green-500"
                                    : "bg-primary-500"
                                  }`}
                                style={{
                                  width: `${(currentStepIndex / (orderSteps.length - 1)) * 100}%`,
                                }}
                              />

                              {/* Steps */}
                              <div className="relative flex justify-between">
                                {orderSteps.map((step, index) => {
                                  const isCompleted = index <= currentStepIndex;
                                  const isCurrent = index === currentStepIndex;

                                  return (
                                    <div
                                      key={step.key}
                                      className="flex flex-col items-center text-center"
                                    >
                                      <div
                                        className={`w-7 h-7 rounded-full border-4 flex items-center justify-center bg-white z-10 transition-all duration-300 ${isCompleted
                                            ? currentStepIndex === orderSteps.length - 1
                                              ? "border-green-500 bg-green-500"
                                              : "border-primary-500 bg-primary-500"
                                            : "border-neutral-300"
                                          }`}
                                      >
                                        {isCompleted ? (
                                          <div className="w-3 h-3 rounded-full bg-white" />
                                        ) : (
                                          <div className="w-2 h-2 rounded-full bg-neutral-300" />
                                        )}
                                      </div>

                                      <div className="mt-3">
                                        <p
                                          className={`text-xs ${isCompleted
                                              ? currentStepIndex === orderSteps.length - 1
                                                ? "text-green-600"
                                                : "text-primary-600"
                                              : "text-neutral-400"
                                            }`}
                                        >
                                          {step.label}
                                        </p>

                                        {isCurrent && (
                                          <p className="text-xs text-neutral-500 mt-1">
                                            Current Status
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Mobile Timeline */}
                          <div className="md:hidden space-y-4">
                            {orderSteps.map((step, index) => {
                              const isCompleted = index <= currentStepIndex;

                              return (
                                <div key={step.key} className="flex items-start gap-3">
                                  <div className="flex flex-col items-center">
                                    <div
                                      className={`w-5 h-5 rounded-full ${isCompleted
                                          ? currentStepIndex === orderSteps.length - 1
                                            ? "bg-green-500"
                                            : "bg-primary-500"
                                          : "bg-neutral-300"
                                        }`}
                                    />

                                    {index !== orderSteps.length - 1 && (
                                      <div
                                        className={`w-7 h-7 ${index < currentStepIndex
                                            ? currentStepIndex === orderSteps.length - 1
                                              ? "bg-green-500"
                                              : "bg-primary-500"
                                            : "bg-neutral-200"
                                          }`}
                                      />
                                    )}
                                  </div>

                                  <div>
                                    <p
                                      className={`font-medium ${isCompleted
                                          ? currentStepIndex === orderSteps.length - 1
                                            ? "text-green-600"
                                            : "text-primary-600"
                                          : "text-neutral-400"
                                        }`}
                                    >
                                      {step.label}
                                    </p>

                                    {index === currentStepIndex && (
                                      <p className="text-xs text-neutral-500 mt-1">
                                        Current Status
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="rounded-3xl bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-700 inline-flex items-center gap-2">
                    <FiPackage className="w-4 h-4" />
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </div>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="h-20 rounded-3xl bg-neutral-100 animate-pulse" />
                    ))}
                  </div>
                ) : error ? (
                  <div className="rounded-3xl border border-error-200 bg-error-50 p-5 text-sm text-error-800">
                    {error}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {itemCount > 0 ? (
                      orderItems.map((item, index) => {
                        const itemName = item.product_name || item.name || item.title || 'Product';
                        const quantity = item.quantity || item.qty || item.order_quantity || 1;
                        const pricePaid = item.price_paid ?? item.paid_price ?? item.price ?? item.offer_price ?? item.amount ?? item.unit_price ?? 0;
                        const size = item.size || item.order_size || item.variant || '';
                        const image = item.image || item.product_image || item.thumbnail || '';
                        const totalPrice = item.total_price ?? item.total ?? item.amount ?? item.price_paid ?? item.paid_price ?? pricePaid * quantity;

                        return (
                          <div key={`${itemName}-${index}`} className="flex gap-4 p-4 rounded-3xl border border-neutral-100 hover:border-primary-200 transition-colors">
                            <div className="w-24 h-24 rounded-3xl overflow-hidden bg-neutral-100 flex items-center justify-center">
                              {image ? (
                                <img src={image} alt={itemName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-xs text-neutral-400">No image</div>
                              )}
                            </div>
                            <div className="flex-1 grid gap-2">
                              <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                                <h2 className="font-semibold text-neutral-900">{itemName}</h2>
                                <p className="font-semibold text-neutral-900">{formatPrice(totalPrice)}</p>
                              </div>
                              <p className="text-sm text-neutral-500">Qty: {quantity}</p>
                              {size ? <p className="text-sm text-neutral-500">Size: {size}</p> : null}
                              <p className="text-sm text-neutral-500">Price paid: {formatPrice(pricePaid)}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="rounded-3xl border border-neutral-100 bg-neutral-50 p-6 text-neutral-600">
                        No products found in this order.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white rounded-3xl p-6 shadow-soft border border-neutral-100">
                  <div className="flex items-center gap-3 mb-4 text-neutral-900">
                    <FiMapPin className="w-5 h-5 text-primary-600" />
                    <h2 className="font-semibold text-lg">Shipping details</h2>
                  </div>
                  <div className="text-sm text-neutral-600 space-y-3">
                    {shippingAddress ? (
                      <p className="whitespace-pre-line">{shippingAddress}</p>
                    ) : (
                      <p>No shipping address available.</p>
                    )}
                    {contactNumber && <p>Phone: <span className="font-medium text-neutral-900">{contactNumber}</span></p>}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-soft border border-neutral-100">
                  <h2 className="font-semibold text-lg text-neutral-900 mb-4">Order summary</h2>
                  <div className="space-y-3 text-sm text-neutral-600">
                    <div className="flex justify-between"><span>Price</span><span>{formatPrice(subtotal)}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(shippingAmount)}</span></div>
                    <div className="flex justify-between"><span>Discount</span><span>-{formatPrice(discountAmount)}</span></div>
                    <div className="border-t border-neutral-100 pt-4 flex justify-between items-center font-semibold text-neutral-900"><span>Total</span><span>{formatPrice(totalAmount)}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-soft border border-neutral-100">
                <h2 className="font-semibold text-lg text-neutral-900 mb-4">Order information</h2>
                <div className="space-y-3 text-sm text-neutral-600">
                  <div className="flex justify-between"><span>Order ID</span><span className="font-medium text-neutral-900">#{id}</span></div>
                  <div className="flex justify-between"><span>Placed on</span><span>{createdAt ? formatDate(createdAt) : '—'}</span></div>
                  <div className="flex justify-between"><span>Delivered in</span><span>4 - 7 Days</span></div>
                  <div className="flex justify-between"><span>Status</span><span className="font-medium text-neutral-900">{status}</span></div>
                  {order?.payment_method && (
                    <div className="flex justify-between"><span>Payment</span><span className="font-medium text-neutral-900">{order.payment_method}</span></div>
                  )}
                  {order?.shipping_method && (
                    <div className="flex justify-between"><span>Shipping method</span><span className="font-medium text-neutral-900">{order.shipping_method}</span></div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-soft border border-neutral-100">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary-50 p-3 text-primary-600">
                    <FiClock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">Need help with this order?</h3>
                    <p className="text-sm text-neutral-600">Reach out to our support team with your order ID for faster assistance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
