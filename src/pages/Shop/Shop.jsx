import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX } from 'react-icons/fi';
import { SITE_NAME, SORT_OPTIONS } from '../../utils/constants';
import { ProductGridSkeleton } from '../../components/common/Skeleton/Skeleton';
import ProductCard from '../../components/product/ProductCard/ProductCard';
import Button from '../../components/common/Button/Button';
import { getAllProducts, getProductCategories } from '../../api/gods-garden/productApi';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Get filter values from URL
  const selectedCategory = searchParams.get('category');
  const sortBy = searchParams.get('sort') || 'newest';

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const cats = await getProductCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const prods = await getAllProducts(selectedCategory);

        // Sort products
        let sortedProducts = [...prods];
        switch (sortBy) {
          case 'price-low':
            sortedProducts.sort((a, b) => (a.offer_price || 0) - (b.offer_price || 0));
            break;
          case 'price-high':
            sortedProducts.sort((a, b) => (b.offer_price || 0) - (a.offer_price || 0));
            break;
          case 'rating':
            sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case 'popular':
            sortedProducts.sort((a, b) => (b.top_selling ? 1 : 0) - (a.top_selling ? 1 : 0));
            break;
          case 'newest':
          default:
            sortedProducts.sort((a, b) => (b.new_arrival ? 1 : 0) - (a.new_arrival ? 1 : 0));
            break;
        }

        setProducts(sortedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, sortBy]);

  // Handle category change
  const handleCategoryChange = useCallback((categoryId) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryId) {
      newParams.set('category', categoryId);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
    setShowFilters(false);
  }, [searchParams, setSearchParams]);

  // Handle sort change
  const handleSortChange = useCallback((value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', value);
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  return (
    <>
      <Helmet>
        <title>{`Shop All Products | ${SITE_NAME}`}</title>
        <meta name="description" content="Browse our complete collection of premium organic spices, dry fruits, seeds, and more." />
        <link rel="canonical" href={`${process.env.REACT_APP_SITE_URL}/shop`} />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200">
          <div className="container-custom py-8">
            <h1 className="font-display text-3xl font-bold text-neutral-900">
              {selectedCategory ? categories.find(c => String(c.id) === selectedCategory)?.name || 'Products' : 'All Products'}
            </h1>
            <p className="text-neutral-600 mt-2">
              Discover our premium collection of organic products
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container-custom py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-xl p-6 shadow-soft sticky top-24">
                <h3 className="font-semibold text-neutral-900 mb-4">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleCategoryChange(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        !selectedCategory
                          ? 'bg-primary-50 text-primary-600 font-medium'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      All Products
                    </button>
                  </li>
                  {isLoadingCategories ? (
                    [...Array(4)].map((_, i) => (
                      <li key={i}>
                        <div className="h-10 bg-neutral-100 rounded-lg animate-pulse" />
                      </li>
                    ))
                  ) : (
                    categories.map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() => handleCategoryChange(category.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedCategory === String(category.id)
                              ? 'bg-primary-50 text-primary-600 font-medium'
                              : 'text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 gap-4">
                <p className="text-neutral-600">
                  {isLoading ? 'Loading...' : `${products.length} products`}
                </p>

                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* Mobile Filter Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<FiFilter />}
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden"
                  >
                    Filters
                  </Button>
                </div>
              </div>

              {/* Products Grid */}
              {isLoading ? (
                <ProductGridSkeleton count={8} />
              ) : products.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl">
                  <p className="text-lg text-neutral-600 mb-4">No products found</p>
                  <Button onClick={() => handleCategoryChange(null)} variant="outline">
                    View All Products
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
              className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 shadow-xl lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                <h4 className="font-medium text-neutral-900 mb-3">Categories</h4>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleCategoryChange(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        !selectedCategory
                          ? 'bg-primary-50 text-primary-600 font-medium'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      All Products
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => handleCategoryChange(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === String(category.id)
                            ? 'bg-primary-50 text-primary-600 font-medium'
                            : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Shop;
