import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { SITE_NAME } from '../../utils/constants';
import { titleCase } from '../../utils/helpers';
import { getAllProducts, getProductCategories } from '../../api/gods-garden/productApi';
import ProductCard from '../../components/product/ProductCard/ProductCard';
import { ProductGridSkeleton } from '../../components/common/Skeleton/Skeleton';
import Button from '../../components/common/Button/Button';

const Category = () => {
  const { slug } = useParams();
  const categoryName = titleCase(slug?.replace(/-/g, ' ') || 'Category');

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const cats = await getProductCategories();
        const matched = cats.find(
          (c) =>
            c.slug === slug ||
            c.name.toLowerCase().replace(/\s+/g, '-') === slug ||
            String(c.id) === slug
        );
        const prods = await getAllProducts(matched?.id || null);
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load category products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [slug]);

  return (
    <>
      <Helmet>
        <title>{`${categoryName} | ${SITE_NAME}`}</title>
        <meta name="description" content={`Shop our collection of ${categoryName.toLowerCase()} products.`} />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen">
        <div className="bg-white border-b border-neutral-200">
          <div className="container-custom py-8">
            <h1 className="font-display text-3xl font-bold text-neutral-900">
              {categoryName}
            </h1>
            <p className="text-neutral-600 mt-2">
              Explore our premium {categoryName.toLowerCase()} collection
            </p>
          </div>
        </div>

        <div className="container-custom py-8">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl">
              <p className="text-lg text-neutral-600 mb-4">No products found in this category</p>
              <Button as={Link} to="/shop" variant="outline">
                View All Products
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Category;
