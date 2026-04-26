import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCurrency } from '../../../context/CurrencyContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useShop } from '../../../context/ShopContext';
import { useToast } from '../../../components/common/Toast/Toast';
import { BestSellerBadge, NewBadge, SaleBadge } from '../../common/Badge/Badge';
import { cn, createSlug } from '../../../utils/helpers';
import { calculateDiscount } from '../../../utils/currency';
import { DEFAULT_PRODUCT_IMAGE, SIZE_LABELS } from '../../../utils/constants';

const ProductCard = ({ product, className }) => {
  const { formatPrice } = useCurrency();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart, isUpdating } = useShop();
  const toast = useToast();

  if (!product) return null;

  const {
    id,
    product_name,
    main_image,
    offer_price,
    mrp,
    pricing,
    rating,
    new_arrival,
    top_selling,
    quantity,
    size = [],
  } = product;

  // Get default size price
  const defaultSize = size?.[0] || 'M';
  const sizePrice = pricing?.[defaultSize] || [mrp, offer_price, 100];
  const displayMrp = sizePrice[0] || mrp;
  const displayPrice = sizePrice[1] || offer_price;

  const discount = calculateDiscount(displayMrp, displayPrice);
  const isWishlisted = isInWishlist(id);
  const productUrl = `/product/${createSlug(product_name)}-${id}`;
  const isInStock = quantity > 0 || (pricing && Object.values(pricing).some(p => p[2] > 0));

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isInStock) {
      toast.error('Product is out of stock');
      return;
    }

    const result = await addToCart(id, defaultSize, 1, displayPrice, displayMrp);
    if (result.success) {
      toast.success('Added to cart');
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group relative bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300',
        className
      )}
    >
      {/* Image Container */}
      <Link to={productUrl} className="block relative overflow-hidden bg-neutral-100" style={{ aspectRatio: '1/1' }}>
        <img
          src={main_image || DEFAULT_PRODUCT_IMAGE}
          alt={product_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {top_selling && <BestSellerBadge />}
          {new_arrival && <NewBadge />}
          {discount > 0 && <SaleBadge discount={discount} />}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleToggleWishlist}
            className={cn(
              'w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center',
              'hover:bg-primary-50 transition-colors',
              isWishlisted && 'text-error-500'
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart className={cn('w-4 h-4', isWishlisted && 'fill-current')} />
          </button>
          <Link
            to={productUrl}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-primary-50 transition-colors"
            aria-label="View product"
          >
            <FiEye className="w-4 h-4" />
          </Link>
        </div>

        {/* Out of Stock Overlay */}
        {!isInStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-2 sm:p-4">
        {/* Size tag */}
        {defaultSize && SIZE_LABELS[defaultSize] && (
          <span className="text-xs text-neutral-500 mb-1 block">
            {SIZE_LABELS[defaultSize]}
          </span>
        )}

        {/* Title */}
        <Link to={productUrl}>
          <h3 className="font-medium text-xs sm:text-sm lg:text-base text-neutral-900 line-clamp-2 mb-1 sm:mb-2 hover:text-primary-600 transition-colors leading-tight">
            {product_name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
          <span className="text-sm sm:text-base lg:text-lg font-bold text-neutral-900">
            {formatPrice(displayPrice)}
          </span>
          {discount > 0 && (
            <>
              <span className="text-xs text-neutral-400 line-through hidden sm:inline">
                {formatPrice(displayMrp)}
              </span>
              <span className="text-xs font-medium text-primary-600">
                {discount}% off
              </span>
            </>
          )}
        </div>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={cn(
                  'w-4 h-4',
                  i < parseInt(rating) ? 'text-accent-500 fill-current' : 'text-neutral-300'
                )}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!isInStock || isUpdating}
          className={cn(
            'w-full py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm',
            'flex items-center justify-center gap-1 sm:gap-2',
            'transition-all duration-200',
            isInStock
              ? 'bg-primary-500 text-white hover:bg-primary-600'
              : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
          )}
        >
          <FiShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
          {isInStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
