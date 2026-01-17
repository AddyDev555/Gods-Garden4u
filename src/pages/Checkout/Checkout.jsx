import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useShop } from '../../context/ShopContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../components/common/Toast/Toast';
import { SITE_NAME, SIZE_LABELS, RAZORPAY_KEY_ID } from '../../utils/constants';
import api from '../../api/gods-garden/axiosConfig';
import Button from '../../components/common/Button/Button';
import Input, { Textarea } from '../../components/common/Input/Input';
import { cn } from '../../utils/helpers';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotals, cartId, clearCart } = useShop();
  const { formatPrice, currency, isIndia } = useCurrency();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile_number: '',
    country_code: '91',
    delivery_address: '',
    city: '',
    state: '',
    pin_code: '',
    comment: '',
  });

  const codFee = paymentMethod === 'cod' ? 39 : 0;
  const total = cartTotals.subtotal + codFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ['name', 'mobile_number', 'delivery_address', 'city', 'state', 'pin_code'];
    for (const field of required) {
      if (!form[field].trim()) {
        toast.error(`Please enter ${field.replace('_', ' ')}`);
        return false;
      }
    }
    if (form.pin_code.length !== 6) {
      toast.error('Please enter a valid 6-digit PIN code');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const orderData = {
        amount: total * 100, // Convert to paise
        currency: currency,
        promo_code: '',
        delivery_address: form.delivery_address,
        name: form.name,
        mobile_number: form.mobile_number,
        country_code: parseInt(form.country_code),
        pin_code: form.pin_code,
        city: form.city,
        state: form.state,
        comment: form.comment,
        cart_id: cartId,
        razorpay: paymentMethod === 'razorpay',
        cash_on_delivery: paymentMethod === 'cod',
      };

      const response = await api.post('/create-order/', orderData);

      if (paymentMethod === 'cod') {
        // COD order created successfully
        clearCart();
        navigate('/checkout/success', { state: { orderId: response.data?.order_id } });
        return;
      }

      // Handle Razorpay payment
      const razorpayOrder = response.data?.data;
      if (!razorpayOrder?.id) {
        throw new Error('Failed to create order');
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: SITE_NAME,
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        handler: async (paymentResponse) => {
          try {
            await api.post('/verify-payment/', {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              amount: total * 100,
              cart_id: cartId,
              razorpay: true,
            });

            clearCart();
            navigate('/checkout/success', { state: { orderId: paymentResponse.razorpay_order_id } });
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.mobile_number,
        },
        theme: {
          color: '#22c55e',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{`Checkout | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container-custom">
          <h1 className="font-display text-3xl font-bold text-neutral-900 mb-8">
            Checkout
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Shipping Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Info */}
                <div className="bg-white rounded-xl p-6 shadow-soft">
                  <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="Mobile Number"
                      name="mobile_number"
                      value={form.mobile_number}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl p-6 shadow-soft">
                  <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <Textarea
                      label="Address"
                      name="delivery_address"
                      value={form.delivery_address}
                      onChange={handleInputChange}
                      rows={3}
                      required
                    />
                    <div className="grid sm:grid-cols-3 gap-4">
                      <Input
                        label="City"
                        name="city"
                        value={form.city}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="State"
                        name="state"
                        value={form.state}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="PIN Code"
                        name="pin_code"
                        value={form.pin_code}
                        onChange={handleInputChange}
                        maxLength={6}
                        required
                      />
                    </div>
                    <Textarea
                      label="Order Notes (Optional)"
                      name="comment"
                      value={form.comment}
                      onChange={handleInputChange}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl p-6 shadow-soft">
                  <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
                  <div className="space-y-3">
                    <label
                      className={cn(
                        'flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors',
                        paymentMethod === 'razorpay' ? 'border-primary-500 bg-primary-50' : 'border-neutral-200'
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-primary-500"
                      />
                      <div>
                        <p className="font-medium">Pay Online</p>
                        <p className="text-sm text-neutral-500">Credit/Debit Card, UPI, Net Banking</p>
                      </div>
                    </label>

                    {isIndia && (
                      <label
                        className={cn(
                          'flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors',
                          paymentMethod === 'cod' ? 'border-primary-500 bg-primary-50' : 'border-neutral-200'
                        )}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-primary-500"
                        />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-neutral-500">+₹39 COD charges</p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 shadow-soft sticky top-24">
                  <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

                  {/* Items */}
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-3 text-sm">
                        <img
                          src={item.image}
                          alt=""
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium line-clamp-1">{item.product_name}</p>
                          <p className="text-neutral-500">
                            {SIZE_LABELS[item.size]} x {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">{formatPrice(item.offer_price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <hr className="my-4" />

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Subtotal</span>
                      <span>{formatPrice(cartTotals.subtotal)}</span>
                    </div>
                    {codFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600">COD Charges</span>
                        <span>{formatPrice(codFee)}</span>
                      </div>
                    )}
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    loading={isLoading}
                    fullWidth
                    size="lg"
                    className="mt-6"
                  >
                    {paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Checkout;
