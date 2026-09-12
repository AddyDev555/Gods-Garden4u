import { motion } from 'framer-motion';


// ─── Animation variants ───────────────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Reviews Data ──────────────────────────────────────────────────────────────

const REVIEWS = [
    {
        id: 1,
        name: 'Avishek Mazumdar',
        date: 'a month ago',
        rating: 5,
        review:
            "Absolutely blown away by the quality and freshness. I discovered God's Garden only recently, and I'm already a fan. I ordered their Mango King Chips along with the Healthy Combo, and every single product exceeded expectations. The natural taste is unbeatable!",
        verified: true,
    },
    {
        id: 2,
        name: 'Priya Sharma',
        date: '2 weeks ago',
        rating: 5,
        review:
            "Visited their store last week and had a great experience. The team was incredibly knowledgeable about the products and helped me choose the perfect organic powders for my daily routine. I really appreciated that they took the time to explain the benefits of each product before I purchased.",
        verified: true,
    },
    {
        id: 3,
        name: 'Rahul Mehta',
        date: '3 weeks ago',
        rating: 5,
        review:
            "I've been buying from God's Garden for over a year now, and the quality has always been top-notch. The dehydrated fruit chips are my absolute favorite – crispy, flavorful, and 100% natural. Their customer service is also outstanding. Highly recommended!",
        verified: true,
    },
    {
        id: 4,
        name: 'Sneha Patel',
        date: '1 week ago',
        rating: 5,
        review:
            "The Healthy Combos are a game-changer for my busy lifestyle. I love that I can get all my daily nutrients in one convenient package. The product quality and freshness are unmatched. Definitely the best organic brand I've come across in India.",
        verified: true,
    },
];

// ─── Star Rating Component ─────────────────────────────────────────────────────

const StarRating = ({ rating, max = 5 }) => (
    <div
        className="flex items-center gap-1 text-yellow-400"
        aria-label={`${rating} out of ${max} stars`}
    >
        {[...Array(max)].map((_, i) => (
            <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={i < rating ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4 sm:w-5 sm:h-5"
            >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ))}
    </div>
);

// ─── Review Card ──────────────────────────────────────────────────────────────

const ReviewCard = ({ review }) => {
    const {
        name,
        date,
        rating,
        review: text,
        verified,
    } = review;

    return (
        <motion.div
            variants={fadeInUp}
            className="
        flex flex-col h-full
        p-5 sm:p-6 md:p-8
        bg-white
        rounded-2xl
        shadow-lg
        hover:shadow-xl
        transition-shadow duration-300
        border border-neutral-100
      "
        >
            {/* Star Rating */}
            <div className="mb-3">
                <StarRating rating={rating} />
            </div>

            {/* Review Text */}
            <p className="text-neutral-700 text-sm sm:text-base leading-relaxed flex-1 mb-4">
                "{text}"
            </p>

            {/* Customer Info */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <div>
                    <h4 className="font-semibold text-neutral-900 text-sm sm:text-base">
                        {name}
                    </h4>

                    <p className="text-neutral-500 text-xs sm:text-sm">
                        {date}
                    </p>
                </div>

                {verified && (
                    <span
                        className="
              inline-flex items-center gap-1
              text-xs font-medium
              text-green-600
              bg-green-50
              px-2.5 py-1
              rounded-full
            "
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-3.5 h-3.5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 13.03l-3.03-3.03a.75.75 0 111.06-1.06l2.47 2.47 5.47-5.47a.75.75 0 111.06 1.06l-6 6a.75.75 0 01-1.06 0z"
                                clipRule="evenodd"
                            />
                        </svg>

                        Verified
                    </span>
                )}
            </div>
        </motion.div>
    );
};

// ─── Reviews Section ──────────────────────────────────────────────────────────

export default function ReviewsSection() {
    return (
        <section className="py-10 sm:py-14 md:py-16 bg-neutral-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div
                className="
          absolute -top-20 -right-20
          w-64 h-64
          rounded-full
          bg-primary-50/30
          pointer-events-none
        "
            />

            <div
                className="
          absolute -bottom-20 -left-20
          w-64 h-64
          rounded-full
          bg-primary-50/30
          pointer-events-none
        "
            />

            <div
                className="
          container-custom
          px-4 sm:px-6 lg:px-8
          mx-auto
          max-w-7xl
          relative z-10
        "
            >
                {/* ── Section Header ── */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="text-center mb-8 sm:mb-12"
                >
                    {/* Rating Badge */}
                    <motion.div
                        variants={fadeInUp}
                        className="
              inline-flex items-center gap-2
              text-green-600
              font-semibold
              text-sm sm:text-base
              bg-green-50
              px-4 py-1.5
              rounded-full
              mb-4
            "
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 sm:w-5 sm:h-5"
                        >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>

                        5,000+ Happy Customers
                    </motion.div>

                    {/* Heading */}
                    <motion.h2
                        variants={fadeInUp}
                        className="
              font-serif
              italic
              text-2xl sm:text-3xl md:text-4xl
              font-bold
              text-neutral-900
              mb-3
            "
                    >
                        Loved by Our Customers
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        variants={fadeInUp}
                        className="
              text-neutral-600
              max-w-2xl
              mx-auto
              text-sm sm:text-base
            "
                    >
                        Real reviews from real people who trust God's Garden
                        for their organic needs
                    </motion.p>
                </motion.div>

                {/* ── Reviews Grid ── */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        margin: '-50px',
                    }}
                    variants={stagger}
                    className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4 sm:gap-6
          "
                >
                    {REVIEWS.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                        />
                    ))}
                </motion.div>

                {/* ── Overall Rating Summary ── */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="mt-8 sm:mt-10 text-center"
                >
                    <div
                        className="
              inline-flex
              flex-col sm:flex-row
              items-center
              gap-3 sm:gap-6
              bg-white
              px-6 sm:px-8
              py-4 sm:py-5
              rounded-2xl
              shadow-md
              border border-neutral-100
            "
                    >
                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <span className="text-3xl sm:text-4xl font-bold text-neutral-900">
                                4.9
                            </span>

                            <div>
                                <StarRating rating={5} />

                                <span className="text-xs text-neutral-500 block">
                                    Based on 5,000+ reviews
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-10 bg-neutral-200" />

                        {/* Brand Rating */}
                        <div className="flex items-center gap-3 text-neutral-600 text-sm sm:text-base">
                            <span>⭐</span>

                            <span className="font-medium">
                                Top rated organic brand
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};