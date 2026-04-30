import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX } from 'react-icons/fi';
import { SITE_NAME, SORT_OPTIONS } from '../../utils/constants';
import { ProductGridSkeleton } from '../../components/common/Skeleton/Skeleton';
import ProductCard from '../../components/product/ProductCard/ProductCard';
import Button from '../../components/common/Button/Button';
import { getAllProducts } from '../../api/gods-garden/productApi';

// Map category_id → display name.
// Extend this object whenever new categories are added in the backend.
const CATEGORY_LABEL_MAP = {
  1: 'Leaf & Indian superfood',
  2: 'Fruits & Vegetable Powders',
  3: 'Fruits Chips',
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);   // raw, unfiltered
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // ─── URL state ────────────────────────────────────────────────────────────
  const selectedCategory = searchParams.get('category');   // string | null
  const sortBy = searchParams.get('sort') || 'newest';

  // ─── Fetch ALL products once ──────────────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await getAllProducts();
        const prods = Array.isArray(response) ? response : (response?.data || []);
        setAllProducts(prods);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ─── Derive unique categories from product data ───────────────────────────
  const categories = useMemo(() => {
    const seen = new Set();
    const result = [];

    allProducts.forEach((product) => {
      const id = product.category_id;
      if (id != null && !seen.has(id)) {
        seen.add(id);
        result.push({
          id,
          name: CATEGORY_LABEL_MAP[id] || `Category ${id}`,
        });
      }
    });

    // Sort by id so the order is stable
    return result.sort((a, b) => a.id - b.id);
  }, [allProducts]);

  // ─── Filter + sort products whenever params or data change ───────────────
  const products = useMemo(() => {
    let list = [...allProducts];

    // Category filter
    if (selectedCategory) {
      const catId = Number(selectedCategory);
      list = list.filter((p) => p.category_id === catId);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        list.sort((a, b) => (a.offer_price ?? a.mrp ?? 0) - (b.offer_price ?? b.mrp ?? 0));
        break;
      case 'price-high':
        list.sort((a, b) => (b.offer_price ?? b.mrp ?? 0) - (a.offer_price ?? a.mrp ?? 0));
        break;
      case 'rating':
        list.sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
        break;
      case 'popular':
        list.sort((a, b) => (b.top_selling ? 1 : 0) - (a.top_selling ? 1 : 0));
        break;
      case 'newest':
      default:
        list.sort((a, b) => (b.new_arrival ? 1 : 0) - (a.new_arrival ? 1 : 0));
        break;
    }

    return list;
  }, [allProducts, selectedCategory, sortBy]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleCategoryChange = useCallback(
    (categoryId) => {
      const newParams = new URLSearchParams(searchParams);
      if (categoryId != null) {
        newParams.set('category', String(categoryId));
      } else {
        newParams.delete('category');
      }
      setSearchParams(newParams);
      setShowFilters(false);
    },
    [searchParams, setSearchParams]
  );

  const handleSortChange = useCallback(
    (value) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('sort', value);
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const getCategoryName = () => {
    if (!selectedCategory) return 'All Products';
    return CATEGORY_LABEL_MAP[Number(selectedCategory)] || 'Products';
  };

  // ─── Shared category list (used in both sidebar + mobile drawer) ──────────
  const CategoryList = () => (
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

      {isLoading ? (
        [...Array(3)].map((_, i) => (
          <li key={i}>
            <div className="h-10 bg-neutral-100 rounded-lg animate-pulse" />
          </li>
        ))
      ) : (
        categories.map((category) => {
          const isSelected = selectedCategory === String(category.id);
          return (
            <li key={category.id}>
              <button
                onClick={() => handleCategoryChange(category.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {category.name}
              </button>
            </li>
          );
        })
      )}
    </ul>
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <Helmet>
        <title>{`${getCategoryName()} | ${SITE_NAME}`}</title>
        <meta
          name="description"
          content="Browse our complete collection of premium organic spices, dry fruits, seeds, and more."
        />
        <link rel="canonical" href={`${process.env.REACT_APP_SITE_URL}/shop`} />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200">
          <div className="container-custom py-8">
            <h1 className="font-display text-3xl font-bold text-neutral-900">
              {getCategoryName()}
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
                <CategoryList />
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
                  <p className="text-lg text-neutral-600 mb-4">
                    No products found in this category
                  </p>
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
                <CategoryList />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Shop;