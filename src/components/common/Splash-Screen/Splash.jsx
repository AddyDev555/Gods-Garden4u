import { useEffect, useState } from "react";

export default function IntroPopup() {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
        }, 2500); // duration (2.5 sec)

        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white transition-all duration-200">

            <div className="text-center animate-fade-in">

                {/* Logo */}
                <img
                    src="/images/icons/godsgarden.jpeg" // replace with your logo path
                    alt="Logo"
                    className="mx-auto w-40 h-40 mb-4"
                />

                {/* Brand Name */}
                <h1 className="text-4xl font-bold text-gray-900">
                    God’s <span className="text-green-500">Garden</span>
                </h1>

                {/* Tagline */}
                <p className="text-xl text-gray-600 mt-2">
                    Har Crunch mai Punch
                </p>
            </div>
        </div>
    );
}