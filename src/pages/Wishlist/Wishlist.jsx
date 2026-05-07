import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { SITE_NAME } from '../../utils/constants';
import { getWishlist, removeWishlistItem } from '../../api/gods-garden/wishlistApi';
import Button from '../../components/common/Button/Button';
import ProductCard from '../../components/product/ProductCard/ProductCard';
import { ProductCardSkeleton } from '../../components/common/Skeleton/Skeleton';

const Wishlist = () => {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const userId = user?.id || user?.user_id || user?.pk || user?.uid;

  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      setError(null);

      if (!isAuthenticated || !userId) {
        setProducts([]);
        setWishlistCount(0);
        setIsLoading(false);
        return;
      }

      try {
        const response = await getWishlist(userId);
        const items = response.data || [];

        const normalizeProduct = (item) => {
          const product = item.product ?? item;
          return {
            ...product,
            id: item.product_id ?? product.id,
            product_name: item.product_name ?? product.product_name ?? product.name,
            main_image:
              item.main_image ?? product.main_image ?? product.image ?? product.product_image,
            offer_price: item.offer_price ?? product.offer_price ?? product.offer_price,
            mrp: item.mrp ?? product.mrp ?? product.price,
            size: item.size ?? product.size ?? [],
            pricing: item.pricing ?? product.pricing ?? {},
            quantity:
              item.quantity ??
              product.quantity ??
              item.stock_quantity ??
              product.stock_quantity ??
              item.available_quantity ??
              product.available_quantity ??
              0,
            slug: item.slug ?? product.slug,
            wishlist_id: item.wishlist_id ?? item.id,
          };
        };

        const mappedProducts = items.map(normalizeProduct);

        setProducts(mappedProducts);
        setWishlistCount(response.total || mappedProducts.length || 0);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
        setError('Failed to load your wishlist. Please try again.');
        setProducts([]);
        setWishlistCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated, userId, refreshKey]);

  const refreshWishlist = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleClearWishlist = async () => {
    if (products.length === 0) {
      return;
    }

    if (!window.confirm('Are you sure you want to clear your wishlist?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await Promise.all(
        products.map((item) => removeWishlistItem({ wishlist_id: item.wishlist_id }))
      );
      setProducts([]);
      setWishlistCount(0);
    } catch (err) {
      console.error('Failed to clear wishlist:', err);
      setError('Failed to clear wishlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmptyState = () => (
    <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
      <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiHeart className="w-10 h-10 text-neutral-400" />
      </div>
      <h2 className="text-xl font-semibold text-neutral-900 mb-2">
        {isAuthenticated ? 'Your wishlist is empty' : 'Please login to view your wishlist'}
      </h2>
      <p className="text-neutral-600 mb-6">
        {isAuthenticated
          ? 'Save items you love for later'
          : 'Login to see the items you have saved in your wishlist.'}
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button as={Link} to={isAuthenticated ? '/shop' : '/login'}>
          {isAuthenticated ? 'Explore Products' : 'Login'}
        </Button>
        {isAuthenticated && (
          <Button as={Link} to="/shop" variant="outline">
            Continue Shopping
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{`Wishlist | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl font-bold text-neutral-900">
              My Wishlist ({wishlistCount} {wishlistCount === 1 ? 'item' : 'items'})
            </h1>
            {wishlistCount > 0 && (
              <button
                onClick={handleClearWishlist}
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-error-500 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
              <p className="text-error-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : wishlistCount === 0 ? (
            renderEmptyState()
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onWishlistChange={refreshWishlist}
                  />
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button as={Link} to="/shop" variant="outline">
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
