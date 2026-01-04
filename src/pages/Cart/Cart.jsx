import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiTag } from 'react-icons/fi';
import { useShop } from '../../context/ShopContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../components/common/Toast/Toast';
import { SITE_NAME, SIZE_LABELS, DEFAULT_PRODUCT_IMAGE } from '../../utils/constants';
import { cn, createSlug } from '../../utils/helpers';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import { CartItemSkeleton } from '../../components/common/Skeleton/Skeleton';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotals, isLoading, isUpdating, removeFromCart, updateQuantity, validatePromoCode } = useShop();
  const { formatPrice, getShippingInfo } = useCurrency();
  const toast = useToast();

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  const shipping = getShippingInfo(cartTotals.subtotal);
  const total = cartTotals.subtotal + (shipping.isFreeShipping ? 0 : 39) - promoDiscount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setIsValidatingPromo(true);
    const result = await validatePromoCode(promoCode, cartTotals.subtotal, cartTotals.itemCount);
    setIsValidatingPromo(false);

    if (result.success) {
      setPromoDiscount(result.discount);
      toast.success(`Promo applied! You saved ${formatPrice(result.discount)}`);
    } else {
      toast.error(result.error);
    }
  };

  const handleRemoveItem = async (item) => {
    const result = await removeFromCart(item.id, item.size, item.offer_price, item.mrp);
    if (result.success) {
      toast.success('Item removed from cart');
    }
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(item);
      return;
    }
    await updateQuantity(item.id, item.size, newQuantity, item.offer_price, item.mrp);
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <h1 className="font-display text-3xl font-bold mb-8">Your Cart</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <CartItemSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>{`Your Cart | ${SITE_NAME}`}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="container-custom py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
              <FiShoppingBag className="w-10 h-10 text-neutral-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-neutral-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-neutral-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button as={Link} to="/shop" size="lg">
              Continue Shopping
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Your Cart (${cartTotals.itemCount} items) | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container-custom">
          <h1 className="font-display text-3xl font-bold text-neutral-900 mb-8">
            Your Cart ({cartTotals.itemCount} items)
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white rounded-xl p-4 shadow-soft"
                  >
                    <div className="flex gap-4">
                      <Link
                        to={`/product/${createSlug(item.product_name || 'product')}-${item.id}`}
                        className="flex-shrink-0"
                      >
                        <img
                          src={item.image || DEFAULT_PRODUCT_IMAGE}
                          alt={item.product_name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${createSlug(item.product_name || 'product')}-${item.id}`}
                          className="font-medium text-neutral-900 hover:text-primary-600 line-clamp-2"
                        >
                          {item.product_name}
                        </Link>

                        <p className="text-sm text-neutral-500 mt-1">
                          Size: {SIZE_LABELS[item.size] || item.size}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-neutral-200 rounded-lg">
                            <button
                              onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                              disabled={isUpdating}
                              className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100"
                            >
                              <FiMinus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                              disabled={isUpdating}
                              className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100"
                            >
                              <FiPlus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price & Remove */}
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-neutral-900">
                              {formatPrice(item.offer_price * item.quantity)}
                            </span>
                            <button
                              onClick={() => handleRemoveItem(item)}
                              disabled={isUpdating}
                              className="p-2 text-neutral-400 hover:text-error-500 transition-colors"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-soft sticky top-24">
                <h2 className="font-semibold text-lg text-neutral-900 mb-4">
                  Order Summary
                </h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Promo code"
                      leftIcon={<FiTag />}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleApplyPromo}
                      loading={isValidatingPromo}
                      variant="outline"
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(cartTotals.subtotal)}</span>
                  </div>

                  {cartTotals.savings > 0 && (
                    <div className="flex justify-between text-primary-600">
                      <span>Savings</span>
                      <span>-{formatPrice(cartTotals.savings)}</span>
                    </div>
                  )}

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-primary-600">
                      <span>Promo Discount</span>
                      <span>-{formatPrice(promoDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    <span className={cn('font-medium', shipping.isFreeShipping && 'text-primary-600')}>
                      {shipping.shippingFeeFormatted}
                    </span>
                  </div>

                  {!shipping.isFreeShipping && (
                    <p className="text-xs text-neutral-500">
                      Add {shipping.amountForFreeShippingFormatted} more for free shipping
                    </p>
                  )}

                  <hr className="my-4" />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/checkout')}
                  fullWidth
                  size="lg"
                  className="mt-6"
                >
                  Proceed to Checkout
                </Button>

                <Link
                  to="/shop"
                  className="block text-center text-sm text-primary-600 hover:text-primary-700 mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
