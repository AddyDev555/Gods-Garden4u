import { FiUsers, FiClock, FiDroplet, FiTruck } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const WHY_FEATURES = [
    {
        icon: FiUsers,
        title: "100% Organic",
        description: "No artificial preservatives, colors, or additives — ever.",
    },
    {
        icon: FiClock,
        title: "Long Shelf Life",
        description: "Naturally dehydrated to stay fresh for months, no refrigeration needed.",
    },
    {
        icon: FiDroplet,
        title: "Nutrient Rich",
        description: "Slow-dehydrated to lock in vitamins, fiber, and natural flavor.",
    },
    {
        icon: FiTruck,
        title: "Free Shipping",
        description: "Free delivery across India on every order, no minimum required.",
    },
];

const GALLERY_IMAGES = [
    {
        id: 1,
        src: "/images/others/other1.png",
        alt: "Assorted dehydrated fruit chips",
    },
    {
        id: 2,
        src: "/images/others/other2.png",
        alt: "Mango powder jar",
    },
    {
        id: 3,
        src: "/images/others/other3.png",
        alt: "Person holding Gods Garden packaging",
    },
    {
        id: 4,
        src: "/images/others/other4.png",
        alt: "Fruit dehydration process",
    },
    {
        id: 5,
        src: "/images/others/other5.png",
        alt: "Bowl of dehydrated vegetable chips",
    },
    {
        id: 6,
        src: "/images/others/other6.png",
        alt: "Gods Garden product display shelf",
    },

    // External images
    {
        id: 7,
        src: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&q=85",
        alt: "Fresh tropical fruits",
    },
    {
        id: 8,
        src: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1200&q=85",
        alt: "Fresh healthy fruit selection",
    },
    {
        id: 9,
        src: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
        alt: "Fresh produce",
    },
    {
        id: 10,
        src: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1200&q=85",
        alt: "Fresh natural food",
    },
    {
        id: 11,
        src: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",
        alt: "Healthy vegetables",
    },
    {
        id: 12,
        src: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=85",
        alt: "Healthy natural ingredients",
    },
];

export default function WhyGodsGarden() {
    const galleryColumns = [
        GALLERY_IMAGES.filter((_, index) => index % 3 === 0),
        GALLERY_IMAGES.filter((_, index) => index % 3 === 1),
        GALLERY_IMAGES.filter((_, index) => index % 3 === 2),
    ];
    return (
        <section className="relative py-14 sm:py-20 bg-white overflow-hidden">
            <div className="container-custom mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                    {/* Left: text content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-serif italic font-extrabold tracking-tight text-[#1d1d1d] mb-10">
                            Why God's Garden?
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 mb-10">
                            {WHY_FEATURES.map((feature) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={feature.title} className="flex items-start gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#22c55e]/30 text-[#22c55e]">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#1d1d1d]">{feature.title}</p>
                                            <p className="text-sm text-neutral-500 mt-0.5">{feature.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <Link
                            to="/shop"
                            type="button"
                            className="inline-flex items-center rounded-md bg-[#1d1d1d] px-8 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-[#22c55e]"
                        >
                            SHOP NOW
                        </Link>
                    </motion.div>

                    {/* Right: continuously moving image collage */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="relative h-[480px] sm:h-[560px] overflow-hidden"
                    >
                        {/* Soft fade at top */}
                        <div className="absolute top-0 left-0 right-0 h-16 z-20 pointer-events-none bg-gradient-to-b from-white to-transparent" />

                        {/* Soft fade at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 z-20 pointer-events-none bg-gradient-to-t from-white to-transparent" />

                        <div className="grid grid-cols-3 gap-3 sm:gap-4 h-full">
                            {galleryColumns.map((column, columnIndex) => (
                                <div
                                    key={columnIndex}
                                    className="relative h-full overflow-hidden"
                                >
                                    <motion.div
                                        animate={{
                                            y: ["0%", "-50%"],
                                        }}
                                        transition={{
                                            duration:
                                                columnIndex === 0
                                                    ? 18
                                                    : columnIndex === 1
                                                        ? 22
                                                        : 20,
                                            ease: "linear",
                                            repeat: Infinity,
                                        }}
                                        className="flex flex-col gap-3 sm:gap-4"
                                    >
                                        {/* First set */}
                                        {column.map((img) => (
                                            <div
                                                key={`first-${img.id}`}
                                                className="relative shrink-0 h-[150px] sm:h-[175px] md:h-[190px] overflow-hidden rounded-xl bg-neutral-100"
                                            >
                                                <img
                                                    src={img.src}
                                                    alt={img.alt}
                                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                                />
                                            </div>
                                        ))}

                                        {/* Duplicate set for seamless loop */}
                                        {column.map((img) => (
                                            <div
                                                key={`second-${img.id}`}
                                                className="relative shrink-0 h-[150px] sm:h-[175px] md:h-[190px] overflow-hidden rounded-xl bg-neutral-100"
                                            >
                                                <img
                                                    src={img.src}
                                                    alt={img.alt}
                                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                                />
                                            </div>
                                        ))}
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}