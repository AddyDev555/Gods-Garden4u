import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
    FiChevronRight,
    FiChevronLeft,
    FiVolume2,
    FiSquare,
    FiPlay,
} from "react-icons/fi";


// ─────────────────────────────────────────────
// Instagram Reels
// ─────────────────────────────────────────────

const TRENDING_VIDEOS = [
    {
        id: 1,
        reelId: "Dc5Y9bUtaPn",
        label: "GOD'S GARDEN",
        title: "Dehydrated Goodness",
    },
    {
        id: 2,
        reelId: "DbfhM_HtKMi",
        label: "GOD'S GARDEN",
        title: "Healthy Snacking",
    },
    {
        id: 3,
        reelId: "DZe--1IoVX2",
        label: "GOD'S GARDEN",
        title: "Natural Goodness",
    },
    {
        id: 4,
        reelId: "DX16frXtbvy",
        label: "GOD'S GARDEN",
        title: "Made to Be Enjoyed",
    },
    {
        id: 5,
        reelId: "DdGW68WtR-R",
        label: "GOD'S GARDEN",
        title: "Taste the Difference",
    },
];


// ─────────────────────────────────────────────
// Instagram Reel Card
// ─────────────────────────────────────────────

function VideoCard({ item }) {

    const [stopped, setStopped] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const stopVideo = () => {
        setStopped(true);
    };

    const playVideo = () => {
        setStopped(false);
        setReloadKey((prev) => prev + 1);
    };

    return (
        <div
            className="
                relative
                flex-shrink-0
                w-[220px]
                sm:w-[250px]
                md:w-[270px]
                aspect-[9/12]
                rounded-2xl
                overflow-hidden
                bg-black
                shadow-md
                snap-start
            "
        >

            {!stopped ? (

                <iframe
                    key={reloadKey}
                    src={`https://www.instagram.com/reel/${item.reelId}/embed/`}
                    title={item.title}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    scrolling="no"
                    allow="
                        autoplay;
                        clipboard-write;
                        encrypted-media;
                        picture-in-picture;
                        web-share
                    "
                    allowFullScreen
                />

            ) : (

                <div
                    className="
                        absolute
                        inset-0
                        flex
                        flex-col
                        items-center
                        justify-center
                        bg-[#1d1d1d]
                        text-white
                    "
                >

                    <FiPlay className="h-10 w-10 mb-3" />

                    <p className="text-sm font-medium">
                        Reel stopped
                    </p>

                    <button
                        type="button"
                        onClick={playVideo}
                        className="
                            mt-4
                            px-5
                            py-2
                            rounded-full
                            bg-white
                            text-[#1d1d1d]
                            text-sm
                            font-semibold
                            transition
                            hover:scale-105
                        "
                    >
                        Play Reel
                    </button>

                </div>

            )}


            {/* ─────────────────────────────
                Bottom gradient
            ───────────────────────────── */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    bottom-0
                    h-32
                    bg-gradient-to-t
                    from-black/70
                    via-black/20
                    to-transparent
                "
            />


            {/* ─────────────────────────────
                Reel information
            ───────────────────────────── */}

            <div
                className="
                    pointer-events-none
                    absolute
                    bottom-16
                    left-0
                    right-0
                    text-center
                    text-white
                "
            >

                <p
                    className="
                        text-[10px]
                        tracking-[0.25em]
                        uppercase
                        opacity-80
                    "
                >
                    {item.label}
                </p>

                <p
                    className="
                        font-serif
                        italic
                        text-xl
                        sm:text-2xl
                    "
                >
                    {item.title}
                </p>

            </div>


            {/* ─────────────────────────────
                Custom controls
            ───────────────────────────── */}

            <div
                className="
                    absolute
                    bottom-3
                    left-3
                    right-3
                    z-30
                    flex
                    items-center
                    justify-between
                "
            >

                {/* Stop / Play */}

                {!stopped ? (

                    <button
                        type="button"
                        onClick={stopVideo}
                        aria-label="Stop reel"
                        title="Stop reel"
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-black/60
                            text-white
                            backdrop-blur-sm
                            transition
                            hover:bg-black/80
                            hover:scale-105
                        "
                    >
                        <FiSquare className="h-4 w-4" />
                    </button>

                ) : (

                    <button
                        type="button"
                        onClick={playVideo}
                        aria-label="Play reel"
                        title="Play reel"
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                            text-[#1d1d1d]
                            transition
                            hover:scale-105
                        "
                    >
                        <FiPlay className="h-4 w-4" />
                    </button>

                )}


                {/* Volume */}

                <button
                    type="button"
                    onClick={() => {
                        // Instagram controls its own audio.
                        // Clicking this button focuses the embedded Reel.
                    }}
                    aria-label="Use Instagram volume controls"
                    title="Use Instagram volume controls"
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        bg-black/60
                        text-white
                        backdrop-blur-sm
                        transition
                        hover:bg-black/80
                        hover:scale-105
                    "
                >
                    <FiVolume2 className="h-4 w-4" />
                </button>

            </div>

        </div>
    );
}


// ─────────────────────────────────────────────
// Trending Now
// ─────────────────────────────────────────────

export default function TrendingNow() {

    const scrollRef = useRef(null);

    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);


    const scrollByAmount = (direction) => {

        const element = scrollRef.current;

        if (!element) return;

        const firstCard = element.firstElementChild;

        const cardWidth = firstCard
            ? firstCard.offsetWidth + 16
            : 280;

        element.scrollBy({
            left: direction * cardWidth * 2,
            behavior: "smooth",
        });
    };


    const handleScroll = () => {

        const element = scrollRef.current;

        if (!element) return;

        setAtStart(
            element.scrollLeft <= 4
        );

        setAtEnd(
            element.scrollLeft + element.clientWidth >=
            element.scrollWidth - 4
        );
    };


    return (

        <section
            className="
                relative
                py-12
                sm:py-16
                bg-white
                overflow-hidden
            "
        >

            <div
                className="
                    container-custom
                    mx-auto
                    max-w-7xl
                    px-4
                    sm:px-6
                    lg:px-8
                "
            >

                {/* Header */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                    className="
                        text-center
                        mb-8
                        sm:mb-10
                    "
                >

                    <h2
                        className="
                            relative
                            inline-block
                            font-serif
                            italic
                            text-2xl
                            sm:text-3xl
                            text-[#1d1d1d]
                        "
                    >
                        Trending Now

                        <span
                            className="
                                absolute
                                left-1/2
                                -translate-x-1/2
                                -bottom-1
                                h-[2px]
                                w-16
                                bg-[#1d1d1d]
                            "
                        />
                    </h2>


                    <p
                        className="
                            mt-3
                            text-sm
                            text-neutral-500
                        "
                    >
                        Watch our latest product highlights.
                    </p>

                </motion.div>


                {/* Carousel */}

                <div className="relative">


                    {/* Left Arrow */}

                    {!atStart && (

                        <button
                            type="button"
                            onClick={() =>
                                scrollByAmount(-1)
                            }
                            aria-label="Scroll left"
                            className="
                                hidden
                                sm:flex
                                absolute
                                -left-4
                                top-1/2
                                -translate-y-1/2
                                z-40
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                                text-neutral-700
                                shadow-[0_4px_14px_rgba(0,0,0,0.15)]
                                transition
                                hover:scale-105
                                hover:shadow-lg
                            "
                        >
                            <FiChevronLeft className="h-5 w-5" />
                        </button>

                    )}


                    {/* Reels */}

                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="
                            flex
                            gap-4
                            sm:gap-5
                            overflow-x-auto
                            scroll-smooth
                            snap-x
                            snap-mandatory
                            pb-2
                            [&::-webkit-scrollbar]:hidden
                            [-ms-overflow-style:'none']
                            [scrollbar-width:'none']
                        "
                    >

                        {TRENDING_VIDEOS.map((item) => (

                            <VideoCard
                                key={item.id}
                                item={item}
                            />

                        ))}

                    </div>


                    {/* Right Arrow */}

                    {!atEnd && (

                        <button
                            type="button"
                            onClick={() =>
                                scrollByAmount(1)
                            }
                            aria-label="Scroll right"
                            className="
                                absolute
                                -right-2
                                sm:-right-4
                                top-1/2
                                -translate-y-1/2
                                z-40
                                h-9
                                w-9
                                sm:h-10
                                sm:w-10
                                flex
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                                text-neutral-700
                                shadow-[0_4px_14px_rgba(0,0,0,0.18)]
                                transition
                                hover:scale-105
                                hover:shadow-lg
                            "
                        >
                            <FiChevronRight className="h-5 w-5" />
                        </button>

                    )}

                </div>

            </div>

        </section>
    );
}