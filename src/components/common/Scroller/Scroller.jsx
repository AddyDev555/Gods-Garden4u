import React, { useState, useEffect } from 'react';

const Scroller = () => {
  const messages = [
    "100% Organic & Natural Products",
    "Free Shipping on Orders Above Rs499",
    "COD Available Across India",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === messages.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="bg-primary-600 text-white py-2 text-center text-sm font-medium fixed top-0 left-0 right-0 z-[60]">
      <p
        key={currentIndex}
        className="animate-fade-in-out px-4"
      >
        {messages[currentIndex]}
      </p>
    </div>
  );
};

export default Scroller;
