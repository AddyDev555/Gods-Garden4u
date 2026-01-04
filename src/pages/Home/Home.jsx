import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FiArrowRight, FiShield, FiTruck, FiAward, FiHeart } from 'react-icons/fi';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '../../utils/constants';
import { getOrganizationSchema, getWebSiteSchema, serializeSchema } from '../../utils/structuredData';
import Button from '../../components/common/Button/Button';
import ProductCard from '../../components/product/ProductCard/ProductCard';
import { ProductCardSkeleton } from '../../components/common/Skeleton/Skeleton';
import { getTopSellingProducts, getNewArrivalProducts, getProductCategories } from '../../api/productApi';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Home = () => {
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [newArrivalProducts, setNewArrivalProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const [topSelling, newArrivals] = await Promise.all([
          getTopSellingProducts(),
          getNewArrivalProducts(),
        ]);
        setTopSellingProducts(topSelling.slice(0, 8));
        setNewArrivalProducts(newArrivals.slice(0, 8));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

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

    fetchProducts();
    fetchCategories();
  }, []);

  const benefits = [
    {
      icon: FiAward,
      title: '100% Organic',
      description: 'Certified organic products sourced directly from trusted farms.',
    },
    {
      icon: FiTruck,
      title: 'Free Shipping',
      description: 'Free delivery on orders above ₹499 across India.',
    },
    {
      icon: FiShield,
      title: 'Quality Assured',
      description: 'Rigorous quality checks to ensure the best for you.',
    },
    {
      icon: FiHeart,
      title: 'Customer Love',
      description: '10,000+ happy customers trust us for their daily needs.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>{SITE_NAME} | Premium Organic Food & Spices</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta property="og:title" content={`${SITE_NAME} | Premium Organic Food & Spices`} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <link rel="canonical" href={SITE_URL} />
        <script type="application/ld+json">
          {serializeSchema([getOrganizationSchema(), getWebSiteSchema()])}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-end justify-center overflow-hidden">
        {/* Full-width banner background */}
        <img
          src="/images/hero/Banner.png"
          alt="Explore Our Diverse Categories - God's Garden Products"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlay for CTA visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative pb-12 md:pb-16 z-10"
        >
          <Button
            as={Link}
            to="/shop"
            size="lg"
            icon={<FiArrowRight />}
            iconPosition="right"
            className="shadow-glow"
          >
            View Products
          </Button>
        </motion.div>
      </section>

      {/* Shop by Category */}
      <section className="section bg-neutral-50">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Shop by Category
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-neutral-600 max-w-2xl mx-auto">
              Explore our wide range of organic products
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {isLoadingCategories ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 bg-neutral-200 rounded-full animate-pulse" />
                  <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
                </div>
              ))
            ) : categories.length > 0 ? (
              categories.slice(0, 8).map((category) => (
                <motion.div key={category.id} variants={fadeInUp}>
                  <Link
                    to={category.navigate_link || `/shop?category=${category.id}`}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                      {category.media ? (
                        <img
                          src={category.media}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                          <span className="text-4xl sm:text-5xl lg:text-6xl">📦</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-neutral-800 text-center group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                  </Link>
                </motion.div>
              ))
            ) : (
              // Fallback static categories
              [
                { name: 'Organic Spices', emoji: '🌶️', slug: 'organic-spices' },
                { name: 'Dry Fruits', emoji: '🥜', slug: 'dry-fruits' },
                { name: 'Seeds & Grains', emoji: '🌾', slug: 'seeds-grains' },
                { name: 'Gift Packs', emoji: '🎁', slug: 'gift-packs' },
              ].map((category) => (
                <motion.div key={category.slug} variants={fadeInUp}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <span className="text-4xl sm:text-5xl lg:text-6xl">{category.emoji}</span>
                    </div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-neutral-800 text-center group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  variants={fadeInUp}
                  className="flex flex-col items-center text-center p-6 rounded-2xl bg-neutral-50 hover:bg-primary-50 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg text-neutral-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Top Selling Products - Commented Out
      <section className="section bg-neutral-50">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Best Sellers
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-neutral-600 max-w-2xl mx-auto">
              Our most popular products loved by customers
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {isLoadingProducts
              ? [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
              : topSellingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          {topSellingProducts.length > 0 && (
            <div className="text-center mt-10">
              <Button
                as={Link}
                to="/shop?sort=popular"
                variant="outline"
                icon={<FiArrowRight />}
                iconPosition="right"
              >
                View All Best Sellers
              </Button>
            </div>
          )}
        </div>
      </section>
      */}

      {/* New Arrivals */}
      <section className="section bg-white">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              New Arrivals
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-neutral-600 max-w-2xl mx-auto">
              Fresh additions to our collection
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {isLoadingProducts
              ? [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
              : newArrivalProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          {newArrivalProducts.length > 0 && (
            <div className="text-center mt-10">
              <Button
                as={Link}
                to="/shop?filter=new"
                variant="outline"
                icon={<FiArrowRight />}
                iconPosition="right"
              >
                View All New Arrivals
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Ready to Experience Premium Quality?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of happy customers who trust God's Garden for their daily needs.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                as={Link}
                to="/shop"
                variant="white"
                size="lg"
                icon={<FiArrowRight />}
                iconPosition="right"
              >
                Explore Products
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
