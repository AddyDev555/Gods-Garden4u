import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FiArrowRight, FiShield, FiTruck, FiAward, FiHeart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '../../utils/constants';
import { getOrganizationSchema, getWebSiteSchema, serializeSchema } from '../../utils/structuredData';
import Button from '../../components/common/Button/Button';
import ProductCard from '../../components/product/ProductCard/ProductCard';
import { ProductCardSkeleton } from '../../components/common/Skeleton/Skeleton';
import { getTopSellingProducts, getNewArrivalProducts, getProductCategories } from '../../api/gods-garden/productApi';

// ─── Hero Slides ──────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/hero/Banner1.png',
    alt: "God's Garden – Mango King Chips Fresh and Natural",
    title: 'Real Mangoes\n',
    titleAccent: 'Real Goodness',
    subtitle: 'Premium Dehydrated Fruit Snacks Made With Care',
    description:
      "Gods Garden offers premium dehydrated fruits, vegetable powders, and natural snacks made without artificial preservatives. We focus on healthy, hygienic, and nutritious products for everyday consumption.",
  },
  {
    id: 2,
    image: '/images/hero/Banner2.png',
    alt: "God's Garden – Pure Organic Products",
    title: 'PURE. NATURAL.\n',
    titleAccent: 'DELICIOUS.',
    subtitle: 'Healthy Snacks, Happy You!',
    description:
      "Gods Garden offers premium dehydrated fruits, vegetable powders, and natural snacks made without artificial preservatives. We focus on healthy, hygienic, and nutritious products for everyday consumption.",
  },
  {
    id: 3,
    image: '/images/hero/Banner3.png',
    alt: "God's Garden – Dehydrated Fruit Chips",
    title: 'CRUNCH. SAVOR.\n',
    titleAccent: 'ENJOY.',
    subtitle: 'Guilt-Free Snacking Redefined',
    description:
      'Discover our range of crispy dehydrated fruit chips — bursting with natural flavor, zero added sugar, and all the goodness of whole fruits in every bite.',
  },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (direction) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const contentVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' },
  }),
};

// ─── HeroCarousel ─────────────────────────────────────────────────────────────
const HeroCarousel = () => {
  const [[activeIndex, direction], setSlide] = useState([0, 0]);
  const autoplayRef = useRef(null);
  const AUTOPLAY_MS = 5000;

  const goTo = useCallback((nextIndex, dir) => {
    setSlide([nextIndex, dir]);
  }, []);

  const prev = useCallback(() => {
    const next = (activeIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    goTo(next, -1);
  }, [activeIndex, goTo]);

  const next = useCallback(() => {
    const next = (activeIndex + 1) % HERO_SLIDES.length;
    goTo(next, 1);
  }, [activeIndex, goTo]);

  // Autoplay
  useEffect(() => {
    autoplayRef.current = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(autoplayRef.current);
  }, [next]);

  const pauseAutoplay = () => clearInterval(autoplayRef.current);
  const resumeAutoplay = () => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(next, AUTOPLAY_MS);
  };

  const slide = HERO_SLIDES[activeIndex];

  return (
    <section
      className="relative min-h-[60vh] md:min-h-[90vh] flex overflow-hidden"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      {/* ── Slide images ── */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
          {/*
            ── FIX: Left-to-right gradient instead of top-to-bottom.
            This darkens only the left side where the text sits,
            keeping the right side of the image bright and vivid.
          ── */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ── Slide content ── */}
      <AnimatePresence mode="wait">
        {/*
          ── FIX: Added w-full and min-h-[60vh] md:min-h-[90vh] so the content
          div fills the full section height and justify-center actually works.
          Removed pt-16 which was pushing content down without centering it.
        ── */}
        <div
          key={`content-${slide.id}`}
          className="relative z-10
            w-full min-h-[60vh] md:min-h-[90vh]
            px-4 sm:px-6 md:px-12 lg:px-20
            pb-10 md:pb-16
            max-w-3xl
            flex flex-col justify-center"
        >

          {/* Title — FIX: switched to white/light green + drop-shadow so it's legible on any image */}
          <motion.h1
            custom={1}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="font-serif
              text-2xl sm:text-3xl md:text-4xl lg:text-5xl
              font-bold leading-tight whitespace-pre-line
              text-white drop-shadow-lg"
          >
            {slide.title}{' '}
            {/* FIX: accent color changed from dark brown (#5B3C1C) to light amber so it pops on dark overlay */}
            <span className="text-amber-300">{slide.titleAccent}</span>
          </motion.h1>

          {/* Subtitle — FIX: was dark brown (#5B3C1C), now white with slight opacity */}
          <motion.p
            custom={2}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="mt-3 text-sm sm:text-base md:text-lg font-semibold text-white/90 drop-shadow"
          >
            {slide.subtitle}
          </motion.p>

          {/* Description — already white, added drop-shadow for legibility */}
          <motion.p
            custom={3}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="mt-2 text-white/80 text-xs sm:text-sm md:text-base w-full md:w-[70%] drop-shadow"
          >
            {slide.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            custom={4}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="pt-5 flex flex-col sm:flex-row gap-3"
          >
            <Button
              as={Link}
              to="/shop"
              className="flex items-center justify-center gap-3
                px-5 py-3 rounded-full
                bg-green-600 text-white font-medium
                hover:bg-green-700 transition-all duration-200 shadow-lg"
            >
              Shop Now
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-green-700">
                <FiArrowRight size={16} />
              </span>
            </Button>

            <Button
              as={Link}
              to="/shop"
              className="flex items-center justify-center
                px-5 py-3 rounded-full
                bg-transparent
                border-2 border-white
                text-white font-medium
                hover:bg-white/10
                transition-all duration-200"
            >
              Explore More
            </Button>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* ── Prev / Next arrows ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20
          w-10 h-10 md:w-12 md:h-12 rounded-full
          bg-white/20 hover:bg-white/40 backdrop-blur-sm
          border border-white/30
          flex items-center justify-center
          text-white transition-all duration-200"
      >
        <FiChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20
          w-10 h-10 md:w-12 md:h-12 rounded-full
          bg-white/20 hover:bg-white/40 backdrop-blur-sm
          border border-white/30
          flex items-center justify-center
          text-white transition-all duration-200"
      >
        <FiChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full
              ${i === activeIndex
                ? 'w-7 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/45 hover:bg-white/70'
              }`}
          />
        ))}
      </div>

      {/* ── Progress bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-white/20">
        <motion.div
          key={`progress-${activeIndex}`}
          className="h-full bg-green-500"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
        />
      </div>
    </section>
  );
};

// ─── Home ─────────────────────────────────────────────────────────────────────
const Home = () => {
  // eslint-disable-next-line no-unused-vars
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
        <title>{`${SITE_NAME} | Organic dehydrated Fruit Chips and Powder`}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta property="og:title" content={`${SITE_NAME} | Organic dehydrated Fruit Chips and Powder`} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <link rel="canonical" href={SITE_URL} />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lato:wght@400;600&display=swap" rel="stylesheet" />
        <script type="application/ld+json">
          {serializeSchema([getOrganizationSchema(), getWebSiteSchema()])}
        </script>
      </Helmet>

      {/* ── Hero Carousel ── */}
      <HeroCarousel />

      {/* ── Shop by Category ── */}
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
                        <img src={category.media} alt={category.name} className="w-full h-full object-cover" />
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
              [
                { name: 'Fruit Chips', emoji: '🍎', slug: 'fruit-chips' },
                { name: 'Fruits', emoji: '🍊', slug: 'fruits' },
                { name: 'Vegetable Powders', emoji: '🥦', slug: 'vegetable-powders' },
                { name: 'Natural Snacks', emoji: '🌿', slug: 'natural-snacks' },
              ].map((category) => (
                <motion.div key={category.slug} variants={fadeInUp}>
                  <Link to={`/category/${category.slug}`} className="flex flex-col items-center gap-3 group">
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

      {/* ── New Arrivals ── */}
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

      {/* ── CTA Section ── */}
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
              Join thousands of happy customers who trust Gods Garden for their daily needs.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-white text-neutral-900 hover:bg-neutral-50 font-medium px-8 py-3 text-lg rounded-xl shadow-soft hover:shadow-medium transition-all duration-300"
              >
                Explore Products
                <FiArrowRight />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Benefits Section ── */}
      <section className="section bg-white">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-10"
          >
            <motion.h2 variants={fadeInUp} className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose Gods Garden?
            </motion.h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((benefit) => {
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
                  <h3 className="font-semibold text-lg text-neutral-900 mb-2">{benefit.title}</h3>
                  <p className="text-neutral-600 text-sm">{benefit.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;