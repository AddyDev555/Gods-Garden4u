import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { useWishlist } from '../../context/WishlistContext';
import { SITE_NAME } from '../../utils/constants';
import { getProductsByIds } from '../../api/productApi';
import Button from '../../components/common/Button/Button';
import ProductCard from '../../components/product/ProductCard/ProductCard';
import { ProductCardSkeleton } from '../../components/common/Skeleton/Skeleton';

const Wishlist = () => {
  const { wishlistItems, wishlistCount, clearWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details when wishlist items change
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlistItems.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const fetchedProducts = await getProductsByIds(wishlistItems);
        // Map API response to expected product format
        const mappedProducts = fetchedProducts.map((product) => ({
          id: product.id,
          product_name: product.name || product.product_name,
          main_image: product.image || product.main_image,
          pricing: product.pricing,
          slug: product.slug,
          offer_price: product.offer_price || (product.pricing?.M?.[1]),
          mrp: product.mrp || (product.pricing?.M?.[0]),
          size: product.size || Object.keys(product.pricing || {}),
        }));
        setProducts(mappedProducts);
      } catch (err) {
        console.error('Failed to fetch wishlist products:', err);
        setError('Failed to load wishlist products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlistItems]);

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      clearWishlist();
    }
  };

  return (
    <>
      <Helmet>
        <title>Wishlist | {SITE_NAME}</title>
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
            <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart className="w-10 h-10 text-neutral-400" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Your wishlist is empty</h2>
              <p className="text-neutral-600 mb-6">Save items you love for later</p>
              <Button as={Link} to="/shop">Explore Products</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
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
