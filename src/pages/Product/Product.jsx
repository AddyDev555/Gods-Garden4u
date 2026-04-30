import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiHeart, FiMinus, FiPlus, FiShoppingCart, FiZoomIn } from 'react-icons/fi';
import api from '../../api/gods-garden/axiosConfig';
import { useCurrency } from '../../context/CurrencyContext';
import { useShop } from '../../context/ShopContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../components/common/Toast/Toast';
import { SITE_NAME, SIZE_LABELS } from '../../utils/constants';
import { parseProductSlug, cn } from '../../utils/helpers';
import { calculateDiscount } from '../../utils/currency';
import { getProductSchema, getBreadcrumbSchema, serializeSchema } from '../../utils/structuredData';
import { ProductDetailSkeleton } from '../../components/common/Skeleton/Skeleton';
import Button from '../../components/common/Button/Button';
import { BestSellerBadge, NewBadge, OrganicBadge } from '../../components/common/Badge/Badge';
import ImageLightbox from '../../components/common/ImageLightbox/ImageLightbox';

const Product = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const productId = parseProductSlug(slug);

  const { formatPrice, currency } = useCurrency();
  const { addToCart, isUpdating } = useShop();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        navigate('/shop');
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get(`/get-product-detail/?product_pk=${productId}&size=${selectedSize}`);
        const data = response.data?.data || response.data;
        setProduct(data);
        console.log(data);

        // Set default size if available
        if (data?.size?.length > 0 && !data.size.includes(selectedSize)) {
          setSelectedSize(data.size[0]);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, navigate]);

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Product Not Found</h1>
        <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
      </div>
    );
  }

  const {
    id,
    product_name,
    description,
    main_image,
    second_media,
    third_media,
    fourth_media,
    fifth_media,
    offer_price,
    mrp,
    pricing,
    size = [],
    rating,
    new_arrival,
    top_selling,
  } = product;

  // Get price for selected size
  const sizePrice = pricing?.[selectedSize] || [mrp, offer_price, 100];
  const displayMrp = sizePrice[0];
  const displayPrice = sizePrice[1];
  const stockQuantity = sizePrice[2] || 0;

  const discount = calculateDiscount(displayMrp, displayPrice);
  const isWishlisted = isInWishlist(id);
  const images = [main_image, second_media, third_media, fourth_media, fifth_media].filter(Boolean);

  const handleAddToCart = async () => {
    if (stockQuantity < 1) {
      toast.error('Product is out of stock');
      return;
    }

    const result = await addToCart(id, selectedSize, quantity, displayPrice, displayMrp);
    if (result.success) {
      toast.success('Added to cart!');
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    const result = await addToCart(id, selectedSize, quantity, displayPrice, displayMrp, true);
    if (result.success) {
      navigate('/checkout');
    }
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    { name: product_name },
  ];

  return (
    <>
      <Helmet>
        <title>{`${product_name} | ${SITE_NAME}`}</title>
        <meta name="description" content={description || product_name} />
        <meta property="og:title" content={product_name} />
        <meta property="og:image" content={main_image} />
        <script type="application/ld+json">
          {serializeSchema([getProductSchema(product, currency), getBreadcrumbSchema(breadcrumbs)])}
        </script>
      </Helmet>

      <div className="bg-white">
        <div className="container-custom py-8">
          {/* Breadcrumbs */}
          <nav className="text-sm text-neutral-500 mb-6">
            {breadcrumbs.map((crumb, i) => (
              <span key={i}>
                {crumb.url ? (
                  <a href={crumb.url} className="hover:text-primary-600">{crumb.name}</a>
                ) : (
                  <span className="text-neutral-900">{crumb.name}</span>
                )}
                {i < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
              </span>
            ))}
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery - Amazon style */}
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnails - vertical on desktop, horizontal on mobile */}
              {images.length > 1 && (
                <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        'flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all',
                        'hover:scale-105 hover:border-primary-300',
                        activeImage === i ? 'border-primary-500 ring-2 ring-primary-200' : 'border-neutral-200'
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image - clickable to open lightbox */}
              <div className="flex-1 relative group">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 cursor-pointer"
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    src={images[activeImage]}
                    alt={product_name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  {/* Zoom hint overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-3 rounded-full shadow-lg">
                      <FiZoomIn className="w-6 h-6 text-neutral-700" />
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {top_selling && <BestSellerBadge />}
                {new_arrival && <NewBadge />}
                <OrganicBadge />
              </div>

              <h1 className="font-display text-2xl lg:text-3xl font-bold text-neutral-900 mb-4">
                {product_name}
              </h1>

              {/* Rating */}
              {rating && (
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={cn('w-5 h-5', i < parseInt(rating) ? 'text-accent-500 fill-current' : 'text-neutral-300')}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                  <span className="text-sm text-neutral-500">({rating}/5)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-neutral-900">
                  {formatPrice(displayPrice)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-neutral-400 line-through">
                      {formatPrice(displayMrp)}
                    </span>
                    <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Size Selection */}
              {size.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {size.map((s) => {
                      const sPrice = pricing?.[s];
                      const inStock = sPrice?.[2] > 0;
                      return (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          disabled={!inStock}
                          className={cn(
                            'px-4 py-2 rounded-lg border transition-all',
                            selectedSize === s
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-neutral-200 hover:border-neutral-300',
                            !inStock && 'opacity-50 cursor-not-allowed line-through'
                          )}
                        >
                          {SIZE_LABELS[s] || s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-neutral-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>

                  {stockQuantity > 0 && stockQuantity <= 10 && (
                    <span className="text-sm text-accent-600">
                      Only {stockQuantity} left!
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <Button
                  onClick={handleAddToCart}
                  disabled={stockQuantity < 1 || isUpdating}
                  loading={isUpdating}
                  icon={<FiShoppingCart />}
                  className="flex-1"
                  size="lg"
                >
                  Add to Cart
                </Button>
                <button
                  onClick={() => {
                    toggleWishlist(id);
                    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                  }}
                  className={cn(
                    'w-14 h-14 rounded-xl border flex items-center justify-center',
                    'transition-all',
                    isWishlisted
                      ? 'border-error-500 bg-error-50 text-error-500'
                      : 'border-neutral-200 hover:border-neutral-300'
                  )}
                >
                  <FiHeart className={cn('w-5 h-5', isWishlisted && 'fill-current')} />
                </button>
              </div>

              <Button
                onClick={handleBuyNow}
                variant="outline"
                disabled={stockQuantity < 1}
                fullWidth
                size="lg"
              >
                Buy Now
              </Button>

              {/* Description */}
              {description && (
                <div className="mt-8 pt-8 border-t border-neutral-200">
                  <h2 className="font-semibold text-lg text-neutral-900 mb-4">Description</h2>
                  <p className="text-neutral-600 leading-relaxed">{description}</p>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-neutral-200">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: '✓', text: '100% Organic' },
                    { icon: '🚚', text: 'Free Shipping over ₹499' },
                    { icon: '↩️', text: 'Easy Returns' },
                    { icon: '🔒', text: 'Secure Payment' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2 text-sm text-neutral-600">
                      <span>{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={images}
        currentIndex={activeImage}
        onIndexChange={setActiveImage}
        alt={product_name}
      />
    </>
  );
};

export default Product;
