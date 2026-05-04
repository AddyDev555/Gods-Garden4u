import { useEffect, useState } from "react";

const reviews = [
    {
        name: "Aarav",
        rating: 5,
        text: "Crispy, fresh, and full of real mango flavor!",
    },
    {
        name: "Sneha",
        rating: 5,
        text: "Perfect crunch with natural sweetness—loved it!",
    },
    {
        name: "Rohit",
        rating: 4,
        text: "Fresh, tasty, and addictive. Ordering again!",
    },
];

export default function Review() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % reviews.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const review = reviews[index];

    return (
        <div className="flex justify-center mt-8">
            <div className="relative w-[320px] sm:w-[380px]">

                {/* Card */}
                <div
                    key={index}
                    className="flex items-center backdrop-blur-md border shadow-lg rounded-2xl p-2 text-center transition-all duration-500 ease-in-out animate-fade"
                >
                    {/* Name */}
                    <p className="text-sm font-semibold text-gray-900">
                        {review.name}
                    </p>
                    <div>
                        {/* Review Text */}
                        <p className="text-slate-100 text-sm leading-relaxed mb-3">
                            “{review.text}”
                        </p>
                    </div>

                    {/* Stars */}
                    <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                            <span
                                key={i}
                                className={`text-lg ${i < review.rating ? "text-yellow-400" : "text-gray-300"
                                    }`}
                            >
                                ★
                            </span>
                        ))}
                    </div>


                </div>
            </div>
        </div>
    );
}