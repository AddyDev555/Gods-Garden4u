import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiFilter } from 'react-icons/fi';
import api from '../../api/axiosConfig';
import { SITE_NAME } from '../../utils/constants';
import { ProductGridSkeleton } from '../../components/common/Skeleton/Skeleton';
import ProductCard from '../../components/product/ProductCard/ProductCard';
import Button from '../../components/common/Button/Button';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/get-all-products/');
        setProducts(response.data?.data || response.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  return (
    <>
      <Helmet>
        <title>Shop All Products | {SITE_NAME}</title>
        <meta name="description" content="Browse our complete collection of premium organic spices, dry fruits, seeds, and more." />
        <link rel="canonical" href={`${process.env.REACT_APP_SITE_URL}/shop`} />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200">
          <div className="container-custom py-8">
            <h1 className="font-display text-3xl font-bold text-neutral-900">
              All Products
            </h1>
            <p className="text-neutral-600 mt-2">
              Discover our premium collection of organic products
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container-custom py-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-neutral-600">
              {isLoading ? 'Loading...' : `${products.length} products`}
            </p>
            <Button
              variant="outline"
              size="sm"
              icon={<FiFilter />}
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              Filters
            </Button>
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-neutral-600">No products found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;
