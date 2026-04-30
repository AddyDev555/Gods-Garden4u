import React from 'react';

const Scroller = () => {
  const messages = [
    "100% Organic & Natural Products",
    "Free Shipping on Orders Above Rs499",
    "COD Available Across India",
  ];

  const looped = [...messages, ...messages, ...messages];

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-green-700 overflow-hidden">
      <div className="py-2.5 text-white text-sm">
        <div className="overflow-hidden whitespace-nowrap">
          <div
          
            style={{
              display: 'inline-flex',
              animation: 'ticker 50s linear infinite',
              paddingLeft: '100%',
            }}
          >
            {looped.map((msg, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  paddingRight: '80px',
                }}
              >
                {msg}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Scroller;