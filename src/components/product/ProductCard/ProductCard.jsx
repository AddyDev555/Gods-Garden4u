import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiEye, FiMessageSquare, FiStar } from 'react-icons/fi';
import { useCurrency } from '../../../context/CurrencyContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useShop } from '../../../context/ShopContext';
import { useToast } from '../../../components/common/Toast/Toast';
import Modal from '../../../components/common/Modal/Modal';
import Input, { Textarea } from '../../../components/common/Input/Input';
import { BestSellerBadge, NewBadge } from '../../common/Badge/Badge';
import { cn, createSlug } from '../../../utils/helpers';
import { calculateDiscount } from '../../../utils/currency';
import { DEFAULT_PRODUCT_IMAGE, SIZE_LABELS } from '../../../utils/constants';
import { createProductReview } from '../../../api/gods-garden/productApi';

const ProductCard = ({ product, className, hideWishlistButton = false, isWishlisted: isWishlistedOverride, onWishlistChange, onReviewAdded }) => {
  const { formatPrice } = useCurrency();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart, isUpdating } = useShop();
  const toast = useToast();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewDescription, setReviewDescription] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');
  const [imageFile1, setImageFile1] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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
  const isWishlisted = typeof isWishlistedOverride === 'boolean' ? isWishlistedOverride : isInWishlist(id);
  const productUrl = `/product/${createSlug(product_name)}-${id}`;
  const pricingHasStock = pricing && Object.values(pricing).some((p) => {
    if (Array.isArray(p)) {
      return Number(p[2] || 0) > 0;
    }
    if (p && typeof p === 'object') {
      return Number(p.quantity || p.stock || p.available || 0) > 0;
    }
    return false;
  });
  const isInStock = Number(quantity || 0) > 0 || pricingHasStock;

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

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await toggleWishlist(id);
    if (result.success) {
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
      if (typeof onWishlistChange === 'function') {
        onWishlistChange();
      }
    } else {
      toast.error(result.error || 'Failed to update wishlist');
    }
  };

  const handleReviewButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewerName.trim()) {
      toast.error('Please enter your name.');
      return;
    }
    if (!reviewDescription.trim()) {
      toast.error('Please enter your review.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const payload = {
        product_pk: id,
        reviewer_name: reviewerName.trim(),
        rating: reviewRating,
        review: reviewDescription.trim(),
      };

      if (imageFile1) {
        payload.image = imageFile1;
      } else if (imageUrl1.trim()) {
        payload.image = imageUrl1.trim();
      }

      if (imageFile2) {
        payload.image_2 = imageFile2;
      } else if (imageUrl2.trim()) {
        payload.image_2 = imageUrl2.trim();
      }

      await createProductReview(payload);
      toast.success('Review submitted successfully');
      setIsReviewModalOpen(false);
      setReviewerName('');
      setReviewDescription('');
      setReviewRating(5);
      setImageUrl1('');
      setImageUrl2('');
      setImageFile1(null);
      setImageFile2(null);
      if (typeof onReviewAdded === 'function') {
        onReviewAdded();
      }
    } catch (error) {
      console.error('Failed to add review:', error);
      toast.error('Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'w-[86%] h-auto lg:w-[100%] lg:h-[100%] group relative bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300',
        className
      )}
    >
      {/* Image Container */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Write a Review"
        size="lg"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div className="grid gap-4">
            <Input
              label="Your Name"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Enter your name"
              required
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className={cn(
                      'rounded-full p-2 transition-colors',
                      star <= reviewRating
                        ? 'bg-yellow-100 text-yellow-500'
                        : 'bg-neutral-100 text-neutral-400 hover:text-yellow-500'
                    )}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  >
                    <FiStar className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Textarea
            label="Review"
            value={reviewDescription}
            onChange={(e) => setReviewDescription(e.target.value)}
            placeholder="Share your thoughts about the product"
            rows={5}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Input
                label="Image URL 1"
                value={imageUrl1}
                onChange={(e) => setImageUrl1(e.target.value)}
                placeholder="Paste image URL"
              />
              <label className="block text-sm font-medium text-neutral-700">Or upload image 1</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile1(e.target.files?.[0] || null)}
                className="w-full text-sm text-neutral-700"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Image URL 2"
                value={imageUrl2}
                onChange={(e) => setImageUrl2(e.target.value)}
                placeholder="Paste image URL"
              />
              <label className="block text-sm font-medium text-neutral-700">Or upload image 2</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile2(e.target.files?.[0] || null)}
                className="w-full text-sm text-neutral-700"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="w-full sm:w-auto px-4 py-3 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingReview}
              className="w-full sm:w-auto px-4 py-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors disabled:opacity-60"
            >
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </Modal>

      <Link to={productUrl} className="block relative overflow-hidden bg-neutral-100" style={{ aspectRatio: '1/1' }}>
        <img
          src={main_image || DEFAULT_PRODUCT_IMAGE}
          alt={product_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!hideWishlistButton && (
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
          )}
          <button
            onClick={handleReviewButtonClick}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-primary-50 transition-colors text-primary-500"
            aria-label="Add review"
          >
            <FiMessageSquare className="w-4 h-4" />
          </button>
          <Link
            to={productUrl}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-primary-50 transition-colors"
            aria-label="View product"
          >
            <FiEye className="w-4 h-4" />
          </Link>
        </div>
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

        {/* Badges */}
        <div className="left-3 flex gap-2 mb-2">
          {top_selling && <BestSellerBadge />}
          {new_arrival && <NewBadge />}
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
