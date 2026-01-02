import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FiArrowRight, FiShield, FiTruck, FiAward, FiHeart } from 'react-icons/fi';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '../../utils/constants';
import { getOrganizationSchema, getWebSiteSchema, serializeSchema } from '../../utils/structuredData';
import Button from '../../components/common/Button/Button';

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
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                100% Organic & Natural
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
                Nourish Your Life with{' '}
                <span className="text-gradient">Nature's Best</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg text-neutral-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Discover premium organic spices, dry fruits, and more.
                Farm-fresh quality delivered to your doorstep.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  as={Link}
                  to="/shop"
                  size="lg"
                  icon={<FiArrowRight />}
                  iconPosition="right"
                  className="shadow-glow"
                >
                  Shop Now
                </Button>
                <Button
                  as={Link}
                  to="/about"
                  variant="outline"
                  size="lg"
                >
                  Our Story
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-neutral-200">
                {[
                  { value: '50+', label: 'Products' },
                  { value: '10K+', label: 'Happy Customers' },
                  { value: '4.9', label: 'Rating' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl sm:text-3xl font-bold text-primary-600">{stat.value}</p>
                    <p className="text-sm text-neutral-500">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full opacity-20 blur-2xl" />
                <div className="relative bg-gradient-to-br from-primary-100 to-primary-200 rounded-full p-8 flex items-center justify-center">
                  <span className="text-[200px]">🌿</span>
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-10 right-0 bg-white rounded-2xl shadow-premium p-4"
                >
                  <span className="text-4xl">🌶️</span>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-20 left-0 bg-white rounded-2xl shadow-premium p-4"
                >
                  <span className="text-4xl">🥜</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
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

      {/* Featured Categories */}
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
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { name: 'Organic Spices', emoji: '🌶️', slug: 'organic-spices' },
              { name: 'Dry Fruits', emoji: '🥜', slug: 'dry-fruits' },
              { name: 'Seeds & Grains', emoji: '🌾', slug: 'seeds-grains' },
              { name: 'Gift Packs', emoji: '🎁', slug: 'gift-packs' },
            ].map((category) => (
              <motion.div key={category.slug} variants={fadeInUp}>
                <Link
                  to={`/category/${category.slug}`}
                  className="block group relative overflow-hidden rounded-2xl bg-white shadow-soft hover:shadow-medium transition-all"
                >
                  <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 group-hover:scale-105 transition-transform duration-500">
                    <span className="text-6xl sm:text-8xl">{category.emoji}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
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
