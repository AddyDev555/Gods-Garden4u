import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '../../context/CurrencyContext';
import { cn } from '../../utils/helpers';
import { FiChevronDown } from 'react-icons/fi';

const CurrencySelector = ({ variant = 'default', className }) => {
  const { currency, setCurrency, currencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentCurrency = currencies[currency];

  const variants = {
    default: 'bg-white border border-neutral-200 hover:border-neutral-300',
    minimal: 'bg-transparent hover:bg-neutral-100',
    dark: 'bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700',
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          variants[variant]
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-lg">{currentCurrency?.flag}</span>
        <span className="text-sm font-medium">
          {currentCurrency?.symbol} {currency}
        </span>
        <FiChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full left-0 mt-2 w-40',
              'bg-white rounded-lg shadow-medium border border-neutral-200',
              'overflow-hidden z-50'
            )}
            role="listbox"
          >
            {Object.entries(currencies).map(([code, config]) => (
              <button
                key={code}
                onClick={() => {
                  setCurrency(code);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3',
                  'text-left transition-colors',
                  currency === code
                    ? 'bg-primary-50 text-primary-600'
                    : 'hover:bg-neutral-50 text-neutral-700'
                )}
                role="option"
                aria-selected={currency === code}
              >
                <span className="text-lg">{config.flag}</span>
                <div>
                  <p className="text-sm font-medium">
                    {config.symbol} {code}
                  </p>
                  <p className="text-xs text-neutral-500">{config.country}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencySelector;
