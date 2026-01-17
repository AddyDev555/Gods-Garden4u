import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { cn } from '../../../utils/helpers';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

const ImageLightbox = ({
  isOpen,
  onClose,
  images = [],
  currentIndex = 0,
  onIndexChange,
  alt = 'Product image',
}) => {
  const hasMultipleImages = images.length > 1;

  const goToNext = useCallback(() => {
    if (hasMultipleImages) {
      const nextIndex = (currentIndex + 1) % images.length;
      onIndexChange(nextIndex);
    }
  }, [currentIndex, images.length, hasMultipleImages, onIndexChange]);

  const goToPrev = useCallback(() => {
    if (hasMultipleImages) {
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      onIndexChange(prevIndex);
    }
  }, [currentIndex, images.length, hasMultipleImages, onIndexChange]);

  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrev();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        default:
          break;
      }
    },
    [onClose, goToPrev, goToNext]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const lightboxContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleOverlayClick}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className={cn(
              'absolute top-4 right-4 z-10 p-3 rounded-full',
              'bg-white/10 text-white hover:bg-white/20',
              'transition-colors'
            )}
            aria-label="Close lightbox"
          >
            <FiX className="w-6 h-6" />
          </button>

          {/* Previous button */}
          {hasMultipleImages && (
            <button
              onClick={goToPrev}
              className={cn(
                'absolute left-4 z-10 p-3 rounded-full',
                'bg-white/10 text-white hover:bg-white/20',
                'transition-colors'
              )}
              aria-label="Previous image"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Main image */}
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={alt}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />

          {/* Next button */}
          {hasMultipleImages && (
            <button
              onClick={goToNext}
              className={cn(
                'absolute right-4 z-10 p-3 rounded-full',
                'bg-white/10 text-white hover:bg-white/20',
                'transition-colors'
              )}
              aria-label="Next image"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Image counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return typeof window !== 'undefined'
    ? createPortal(lightboxContent, document.body)
    : null;
};

export default ImageLightbox;
