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
import Reviews from '../../components/common/Reviews/Review';
import IntroPopup from '../../components/common/Splash-Screen/Splash';

// ─── WhatsApp config ──────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '917738489220'; // replace with actual number (country code + number, no +)
const WHATSAPP_MESSAGE = encodeURIComponent("Hi! I'd like to know more about God's Garden products 🌿");
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

// ─── WhatsApp Button Component ────────────────────────────────────────────────
const WhatsAppButton = ({ className = '', size = 'md', label = 'Chat on WhatsApp' }) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-3',
    lg: 'px-8 py-4 text-lg gap-3',
  };

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center font-semibold rounded-lg
        bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1aaa50]
        text-white shadow-lg hover:shadow-xl
        transition-all duration-200 hover:scale-105 active:scale-95
        ${sizeClasses[size]} ${className}`}
    >
      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      {label}
    </a>
  );
};

// ─── Floating WhatsApp FAB ────────────────────────────────────────────────────
const WhatsAppFAB = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-5 right-5 z-50
      w-14 h-14 rounded-full
      bg-[#25D366] hover:bg-[#20bd5a]
      flex items-center justify-center
      shadow-2xl hover:shadow-green-400/40
      transition-all duration-200 hover:scale-110 active:scale-95"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  </a>
);

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
    title: 'Pure. Natural.\n',
    titleAccent: 'Delicious.',
    subtitle: 'Healthy Snacks, Happy You!',
    description:
      "Gods Garden offers premium dehydrated fruits, vegetable powders, and natural snacks made without artificial preservatives. We focus on healthy, hygienic, and nutritious products for everyday consumption.",
  },
  {
    id: 3,
    image: '/images/hero/Banner3.png',
    alt: "God's Garden – Dehydrated Fruit Chips",
    title: 'Crunch. Savor.\n',
    titleAccent: 'Enjoy.',
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
      className="relative min-h-[45vh] max-h-[50vh] sm:min-h-[70vh] md:min-h-[90vh] flex overflow-hidden"
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
            className="w-full md:h-full md:object-cover md:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
          {/* Extra bottom gradient on mobile so dots/text are legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:hidden" />
        </motion.div>
      </AnimatePresence>

      {/* ── Slide content ── */}
      <AnimatePresence mode="wait">
        <div
          key={`content-${slide.id}`}
          className="relative z-10
            w-full min-h-[55vh] sm:min-h-[70vh] md:min-h-[90vh]
            px-5 sm:px-8 md:px-12 lg:px-20
            pb-16 md:pb-20
            max-w-3xl
            flex flex-col justify-end md:justify-center"
        >
          <motion.h1
            custom={1}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="font-display
              text-4xl sm:text-4xl md:text-5xl lg:text-6xl
              font-bold leading-tight whitespace-pre-line
              text-white drop-shadow-lg"
          >
            {slide.title}{' '}
            <span className="text-amber-300">{slide.titleAccent}</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-white/90 drop-shadow"
          >
            {slide.subtitle}
          </motion.p>

          <motion.p
            custom={3}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="mt-2 text-white/80 text-xs sm:text-sm md:text-base w-full md:w-[70%] drop-shadow hidden sm:block"
          >
            {slide.description}
          </motion.p>

          {/* <motion.div 
            custom={3}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <Reviews />
          </motion.div> */}

          {/* CTA Buttons */}
          <motion.div
            custom={4}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="pt-4 md: sm:pt-5 flex flex-col xs:flex-row sm:flex-row gap-2 sm:gap-3"
          >
            {/* Primary: WhatsApp Order */}
            <WhatsAppButton
              label="Order on WhatsApp"
              size="md"
              className="shadow-2xl"
            />

            {/* Secondary: Shop */}
            <Button
              as={Link}
              to="/shop"
              className="flex items-center justify-center
                px-5 py-3 rounded-full
                bg-transparent
                border-2 border-white
                text-white font-medium text-sm sm:text-base
                hover:bg-white/10
                transition-all duration-200"
            >
              Shop Now
              <FiArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* ── Prev / Next arrows — hidden on small phones ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20
          w-9 h-9 md:w-12 md:h-12 rounded-full
          bg-white/20 hover:bg-white/40 backdrop-blur-sm
          border border-white/30
          items-center justify-center
          text-white transition-all duration-200"
      >
        <FiChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <button
        onClick={next}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20
          w-9 h-9 md:w-12 md:h-12 rounded-full
          bg-white/20 hover:bg-white/40 backdrop-blur-sm
          border border-white/30
          items-center justify-center
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
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/45 hover:bg-white/70'
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
      <IntroPopup />
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
      <section className="py-10 sm:py-14 md:py-16 bg-neutral-50">
        <div className="container-custom px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.h2 variants={fadeInUp} className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
              Shop by Category
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-neutral-600 max-w-2xl mx-auto text-sm sm:text-base">
              Explore our wide range of organic products
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
          >
            {isLoadingCategories ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-neutral-200 rounded-full animate-pulse" />
                  <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
                </div>
              ))
            ) : categories.length > 0 ? (
              categories.slice(0, 8).map((category) => (
                <motion.div key={category.id} variants={fadeInUp}>
                  <Link
                    to={category.navigate_link || `/shop?category=${category.id}`}
                    className="flex flex-col items-center gap-2 sm:gap-3 group"
                  >
                    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                      {category.media ? (
                        <img src={category.media} alt={category.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                          <span className="text-3xl sm:text-4xl lg:text-6xl">📦</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-neutral-800 text-center group-hover:text-primary-600 transition-colors">
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
                  <Link to={`/category/${category.slug}`} className="flex flex-col items-center gap-2 sm:gap-3 group">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl lg:text-6xl">{category.emoji}</span>
                    </div>
                    <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-neutral-800 text-center group-hover:text-primary-600 transition-colors">
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
      <section className="py-10 sm:py-14 md:py-16 bg-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.h2 variants={fadeInUp} className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
              New Arrivals
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-neutral-600 max-w-2xl mx-auto text-sm sm:text-base">
              Fresh additions to our collection
            </motion.p>
          </motion.div>

          {/* 2 cols on mobile, 3 on tablet, 4 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {isLoadingProducts
              ? [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
              : newArrivalProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>

          {newArrivalProducts.length > 0 && (
            <div className="text-center mt-8 sm:mt-10">
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

      {/* ── CTA Section — WhatsApp-focused ── */}
      <section className="py-12 sm:py-16 bg-green-700 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

        <div className="container-custom px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="font-display text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Ready to Experience Premium Quality?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-green-100 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Join thousands of happy customers who trust Gods Garden. Order directly or ask us anything — we're just a message away!
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              {/* Primary: WhatsApp */}
              <WhatsAppButton
                label="Chat &amp; Order on WhatsApp"
                size="lg"
                className="w-full sm:w-auto"
              />

              {/* Secondary: Browse */}
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2
                  w-full sm:w-auto
                  border-2 border-white text-white hover:bg-white hover:text-green-700
                  font-semibold px-8 py-4 text-base rounded-full
                  transition-all duration-300"
              >
                Browse Products
                <FiArrowRight />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Benefits Section ── */}
      <section className="py-10 sm:py-14 md:py-16 bg-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-8 sm:mb-10"
          >
            <motion.h2 variants={fadeInUp} className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
              Why Choose Gods Garden?
            </motion.h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  variants={fadeInUp}
                  className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl bg-neutral-50 hover:bg-primary-50 transition-colors"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-3 sm:mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-neutral-900 mb-1 sm:mb-2">{benefit.title}</h3>
                  <p className="text-neutral-600 text-xs sm:text-sm">{benefit.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Floating WhatsApp FAB ── */}
      <WhatsAppFAB />
    </>
  );
};

export default Home;