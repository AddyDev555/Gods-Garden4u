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
      <div className="py-2.5 text-white text-sm flex items-center justify-between px-4">
        {/* <div className="flex items-center gap-2">
          <div className='flex items-center gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 
                    19.79 19.79 0 0 1-8.63-3.07 
                    19.5 19.5 0 0 1-6-6 
                    19.79 19.79 0 0 1-3.07-8.67A2 
                    2 0 0 1 4.11 2h3a2 2 0 0 1 
                    2 1.72c.12.81.37 1.6.72 
                    2.34a2 2 0 0 1-.45 
                    2.11L8.09 9.91a16 16 0 0 0 
                    6 6l1.74-1.29a2 2 0 0 1 
                    2.11-.45c.74.35 1.53.6 
                    2.34.72a2 2 0 0 1 1.72 2z"/>
            </svg>
            <p>7738489220</p>
          </div>
          <div className='flex items-center gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          <p>Dombivali, Maharashtra, India</p>
          </div>
        </div> */}
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