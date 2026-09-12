import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FiArrowRight, FiArrowUpRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '../../utils/constants';
import { getOrganizationSchema, getWebSiteSchema, serializeSchema } from '../../utils/structuredData';
import Button from '../../components/common/Button/Button';
import ProductCard from '../../components/product/ProductCard/ProductCard';
import { ProductCardSkeleton } from '../../components/common/Skeleton/Skeleton';
import { getProductCategories, getAllProducts } from '../../api/gods-garden/productApi';
import IntroPopup from '../../components/common/Splash-Screen/Splash';
import TrendingNow from "./components/Trending";
import WhyGodsGarden from './components/Whyus';
// import ReviewsSection from './components/Reviews';

const MOOD_IMAGES = [
  {
    id: 1,
    label: "COUPLES",
    image: "/images/Reviews/review3.jpg",
    rotation: "-rotate-[10deg]",
    offset: "translate-y-2",
  },
  {
    id: 2,
    label: "CHILDRENS",
    image: "/images/Reviews/review2.jpg",
    rotation: "rotate-[6deg]",
    offset: "-translate-y-2",
  },
  {
    id: 3,
    label: "OFFICERS",
    image: "/images/Reviews/review1.jpg",
    rotation: "-rotate-[4deg]",
    offset: "translate-y-1",
  },
  {
    id: 4,
    label: "OFFICERS",
    image: "/images/Reviews/review4.jpeg",
    rotation: "rotate-[8deg]",
    offset: "-translate-y-1",
  },
  {
    id: 5,
    label: "OFFICERS",
    image: "/images/Reviews/review5.jpeg",
    rotation: "-rotate-[6deg]",
    offset: "translate-y-2",
  },
  {
    id: 7,
    label: "OFFICERS",
    image: "/images/Reviews/review7.jpeg",
    rotation: "rotate-[5deg]",
    offset: "-translate-y-1",
  },
  {
    id: 8,
    label: "OFFICERS",
    image: "/images/Reviews/review8.jpeg",
    rotation: "-rotate-[8deg]",
    offset: "translate-y-2",
  },
  {
    id: 9,
    label: "OFFICERS",
    image: "/images/Reviews/review9.jpeg",
    rotation: "rotate-[6deg]",
    offset: "-translate-y-2",
  },
];

// ─── Star Rating Component ────────────────────────────────────────────────────

// ─── WhatsApp config ──────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '917738489220'; // replace with actual number (country code + number, no +)
const WHATSAPP_MESSAGE = encodeURIComponent("Hi! I'd like to know more about God's Garden products 🌿");
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const LeafDivider = ({ flip = false, className = '' }) => (
  <div className={`mt-18 pointer-events-none select-none ${className}`} aria-hidden="true">
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`w-full h-5 sm:h-14 ${flip ? 'rotate-180' : ''}`}
    >
      <path
        d="M0 40 C 240 10, 360 70, 600 40 S 1000 10, 1200 45 S 1440 30, 1440 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-primary-300/70"
      />
      <path
        d="M0 40 C 240 10, 360 70, 600 40 S 1000 10, 1200 45 S 1440 30, 1440 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeDasharray="2 6"
        className="text-primary-500/60"
        transform="translate(0, 6)"
      />
    </svg>
  </div>
);

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
        shadow-lg hover:shadow-xl md:text-base text-xs
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
      transition-all duration-200 hover:scale-110 active:scale-95 text-white"
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
    desktopImage: '/images/hero/banner_1_desktop.png',
    mobileImage: '/images/hero/banner_1_mobile.jpeg',
    alt: "God's Garden – Mango King Chips Fresh and Natural",
  },
  {
    id: 2,
    desktopImage: '/images/hero/banner_2_desktop.png',
    mobileImage: '/images/hero/banner_2_mobile.jpeg',
    alt: "God's Garden – Pure Organic Products",
  },
  {
    id: 3,
    desktopImage: '/images/hero/banner_3_desktop.png',
    mobileImage: '/images/hero/banner_3_mobile.jpeg',
    alt: "God's Garden – Dehydrated Fruit Chips",
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

const HEALTHY_COMBO_CATEGORY_ID = 5;

const HOMEPAGE_CATEGORY_ORDER = [
  'fruits chips',
  'healthy combo',
  'leaf / superfood',
  'fruits & vegetable powders',
];

const CATEGORY_NAME_ALIAS = {
  'fruit chips': 'fruits chips',
  'leaf & indian superfood': 'leaf / superfood',
  'leaf & superfood': 'leaf / superfood',
  'fruit & vegetable powders': 'fruits & vegetable powders',
  'fruits and vegetable powders': 'fruits & vegetable powders',
  'healthy combos': 'healthy combo'
};

const normalizeCategoryName = (name) => {
  if (!name) return '';
  const normalized = name.toString().trim().toLowerCase().replace(/\s+/g, ' ').replace(/ and /g, ' & ');
  return CATEGORY_NAME_ALIAS[normalized] || normalized;
};

const getCategoryOrderIndex = (name) => {
  const normalized = normalizeCategoryName(name);
  const index = HOMEPAGE_CATEGORY_ORDER.indexOf(normalized);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

const sortCategoriesByHomepageOrder = (categories) =>
  [...categories].sort((a, b) => {
    const indexA = getCategoryOrderIndex(a.name);
    const indexB = getCategoryOrderIndex(b.name);
    if (indexA !== indexB) return indexA - indexB;
    return (a.name || '').localeCompare(b.name || '');
  });

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
      className="relative h-[60vh] sm:min-h-[60vh] md:min-h-[74vh] flex overflow-hidden"
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
          className="absolute top-3 inset-0 touch-pan-y"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = Math.abs(offset.x) * velocity.x;

            if (swipe < -10000) {
              next();
            } else if (swipe > 10000) {
              prev();
            }
          }}
        >
          <picture className="w-full">
            <source media="(min-width: 768px)" srcSet={slide.desktopImage} />
            <img
              src={slide.mobileImage}
              alt={slide.alt}
              className="w-full h-auto object-cover object-center"
            />
          </picture>
          {/* <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" /> */}
          {/* Extra bottom gradient on mobile so dots/text are legible */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:hidden" /> */}
        </motion.div>
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
  const [healthyComboProducts, setHealthyComboProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);

      try {
        const products = await getAllProducts();

        setAllProducts(products);

        const topSelling = products.filter((p) => p.top_selling);
        const newArrivals = products.filter((p) => p.new_arrival);
        const healthyCombos = products.filter(
          (p) => Number(p.category_id) === HEALTHY_COMBO_CATEGORY_ID
        );

        setTopSellingProducts(topSelling.slice(0, 8));
        setNewArrivalProducts(newArrivals.slice(0, 8));
        setHealthyComboProducts(healthyCombos.slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    const extractCategoryIdFromLink = (navigateLink) => {
      if (!navigateLink) return null;
      const match = navigateLink.match(/[?&]category=(\d+)/);
      return match ? Number(match[1]) : null;
    };

    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const cats = await getProductCategories();

        // Normalize: attach a real numeric id derived from navigate_link
        const catsWithId = cats.map((cat) => ({
          ...cat,
          id: extractCategoryIdFromLink(cat.navigate_link),
        }));

        const sortedCats = sortCategoriesByHomepageOrder(catsWithId);
        setCategories(sortedCats);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && activeCategoryId === null) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

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

          {/* Heading */}
          <motion.div
            initial="visible"
            animate="visible"
            variants={stagger}
            className="text-center mb-7 sm:mb-10"
          >
            <motion.h2
              variants={fadeInUp}
              className="
          font-display
          text-2xl sm:text-3xl md:text-4xl
          font-bold
          text-neutral-900
          mb-3
        "
            >
              Shop by Category
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-neutral-600 max-w-2xl mx-auto text-sm sm:text-base"
            >
              Explore our wide range of organic products
            </motion.p>
          </motion.div>


          {/* ── Category Menu ── */}
          {!isLoadingCategories && categories.length > 0 && (
            <div className="mb-8 sm:mb-10">

              {/* Horizontal scrolling category navigation */}
              <div
                className="
            flex
            items-center
            justify-start
            sm:justify-center
            gap-6
            sm:gap-8
            md:gap-10
            overflow-x-auto
            pb-3
            px-1
            [&::-webkit-scrollbar]:hidden
            [-ms-overflow-style:'none']
            [scrollbar-width:'none']
          "
              >
                {categories.map((category) => {
                  const isActive =
                    Number(activeCategoryId) === Number(category.id);

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveCategoryId(category.id)}
                      className={`
                  relative
                  flex-shrink-0
                  pb-2
                  text-sm
                  sm:text-base
                  font-medium
                  whitespace-nowrap
                  transition-colors
                  duration-300

                  ${isActive
                          ? "text-neutral-900"
                          : "text-neutral-400 hover:text-neutral-700"
                        }
                `}
                    >
                      {category.name}

                      {/* Active underline */}
                      <span
                        className={`
                    absolute
                    left-0
                    right-0
                    bottom-0
                    mx-auto
                    h-[2px]
                    bg-neutral-900
                    transition-all
                    duration-300
                    ${isActive
                            ? "w-full opacity-100"
                            : "w-0 opacity-0"
                          }
                  `}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}


          {/* ── Products ── */}
          {(() => {
            const activeCategory = categories.find(
              (category) =>
                String(category.id) === String(activeCategoryId)
            );

            const categoryProducts = activeCategory
              ? allProducts
                .filter(
                  (product) =>
                    String(product.category_id) === String(activeCategory.id)
                )
                .slice(0, 4)
              : [];
            return (
              <>
                {/* Loading */}
                {isLoadingProducts ? (
                  <div
                    className="
                grid
                grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                gap-3
                sm:gap-4
                lg:gap-6
              "
                  >
                    {[...Array(4)].map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </div>
                ) : categoryProducts.length > 0 ? (

                  /* Products */
                  <motion.div
                    key={activeCategoryId}
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="
                grid
                grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                gap-3
                sm:gap-4
                lg:gap-6
              "
                  >
                    {categoryProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        variants={fadeInUp}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>

                ) : (

                  /* No products */
                  <div className="py-12 text-center">
                    <p className="text-neutral-500 text-sm sm:text-base">
                      No products available in this category.
                    </p>
                  </div>
                )}


                {/* ── View More ── */}
                {categoryProducts.length > 0 && activeCategory && (
                  <div className="text-center mt-8 sm:mt-10">
                    <Button
                      as={Link}
                      to={
                        activeCategory.navigate_link ||
                        `/shop?category=${activeCategory.id}`
                      }
                      variant="outline"
                      icon={<FiArrowRight />}
                      iconPosition="right"
                    >
                      View More
                    </Button>
                  </div>
                )}
              </>
            );
          })()}

        </div>

        <LeafDivider className="text-primary-200" />
      </section>



      {/* ── New Arrivals ── */}
      <section className="py-10 sm:py-5 md:py-5 relative overflow-hidden">
        <div className="container-custom px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.h2 variants={fadeInUp} className="font-serif italic text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
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

      {/* ── Pick Your Mood ── */}
      <section className="relative py-5 sm:py-12 mt-5 md:py-16 overflow-hidden">

        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source src="/images/Reviews/happiness.mp4" type="video/mp4" />
        </video>

        {/* Beige overlay — controls how visible the video is */}
        <div className="absolute inset-0 bg-[#f5f0e6]/75" />

        {/* Optional subtle white wash */}
        <div className="absolute inset-0 bg-white/10" />

        <div className="container-custom px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl relative z-10">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-10 sm:mb-14"
          >
            <motion.p
              variants={fadeInUp}
              className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#15803d] mb-[-8px] relative z-10"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
            >
              Happiness
            </motion.p>

            <motion.h2
              variants={fadeInUp}
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1d1d1d] leading-none"
            >
              in Every Bite
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="font-serif text-sm text-[#1d1d1d] leading-none"
            >
              happy customers, and flavours made to be enjoyed.
            </motion.p>
          </motion.div>

          {/* Your existing polaroid cards */}
          {/* ── Mobile Gallery: 2 straight images per row ── */}
          <div className="grid grid-cols-2 gap-3 sm:hidden">
            {MOOD_IMAGES.map((item, index) => (
              <motion.div
                key={item.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.08 }}
                className="relative"
              >
                <div
                  className="
          relative
          w-full
          bg-white
          p-1.5
          pb-1.5
          rounded-[2px]
          shadow-[0_6px_15px_rgba(0,0,0,0.15)]
        "
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${item.image})`,
                      }}
                    />
                  </div>

                  <div className="h-2" />
                </div>
              </motion.div>
            ))}
          </div>


          {/* ── Desktop Gallery: overlapping rotated polaroids ── */}
          <div className="hidden sm:flex items-center justify-center flex-nowrap">
            {MOOD_IMAGES.map((item, index) => {
              const isHovered = hoveredIndex === index;

              return (
                <motion.div
                  key={item.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.08 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    zIndex: isHovered ? 40 : index,
                    marginLeft: index === 0 ? 0 : "-2.75rem",
                  }}
                  className="relative"
                >
                  <div
                    className={`
            relative
            w-[190px] md:w-[210px] lg:w-[230px]
            bg-white
            p-2
            pb-0
            rounded-[2px]
            shadow-[0_10px_25px_rgba(0,0,0,0.18)]
            transition-all
            duration-500
            ease-out
            ${item.rotation}
            ${item.offset}
            ${isHovered
                        ? "!rotate-0 !translate-y-0 scale-110 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                        : ""
                      }
          `}
                  >
                    <div className="relative w-full aspect-[4/5] overflow-hidden">
                      <div
                        className="
                absolute inset-0
                bg-cover
                bg-center
                bg-no-repeat
                transition-transform
                duration-500
              "
                        style={{
                          backgroundImage: `url(${item.image})`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between px-1 py-4">
                      {item.hasArrow && (
                        <FiArrowUpRight className="h-5 w-5 text-[#c0392b] shrink-0" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── Healthy Combos ── */}
      <section className="py-10 sm:py-14 md:py-16 bg-neutral-50">
        <div className="container-custom px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.h2 variants={fadeInUp} className="font-serif italic text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
              Healthy Combos
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-neutral-600 max-w-2xl mx-auto text-sm sm:text-base">
              Perfect combinations for your healthy lifestyle
            </motion.p>
          </motion.div>

          {isLoadingProducts || healthyComboProducts.length > 0 ? (
            <>
              {/* 2 cols on mobile, 3 on tablet, 4 on desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {isLoadingProducts
                  ? [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
                  : healthyComboProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>

              <div className="text-center mt-8 sm:mt-10">
                <Button
                  as={Link}
                  to={`/shop?category=${HEALTHY_COMBO_CATEGORY_ID}`}
                  variant="outline"
                  icon={<FiArrowRight />}
                  iconPosition="right"
                >
                  View All Healthy Combos
                </Button>
              </div>
            </>
          ) : !isLoadingProducts && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🥗</div>
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">Coming Soon</h3>
              <p className="text-neutral-500">Exciting healthy combos are on the way!</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <TrendingNow />
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
            <motion.h2 variants={fadeInUp} className="font-serif italic text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
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

      <section>
        <WhyGodsGarden />
      </section>

      {/* <ReviewsSection /> */}

      {/* ── Floating WhatsApp FAB ── */}
      <WhatsAppFAB />
    </>
  );
};

export default Home;