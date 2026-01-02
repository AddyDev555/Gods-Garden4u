import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { cn } from '../../../utils/helpers';
import { TOAST_DURATION } from '../../../utils/constants';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

// Toast Context
const ToastContext = createContext(null);

// Toast variants
const toastVariants = {
  success: {
    icon: FiCheck,
    className: 'bg-success-500',
    iconBg: 'bg-success-600',
  },
  error: {
    icon: FiX,
    className: 'bg-error-500',
    iconBg: 'bg-error-600',
  },
  warning: {
    icon: FiAlertCircle,
    className: 'bg-warning-500',
    iconBg: 'bg-warning-600',
  },
  info: {
    icon: FiInfo,
    className: 'bg-info-500',
    iconBg: 'bg-info-600',
  },
};

// Animation variants
const motionVariants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.95 },
};

// Single Toast Component
const ToastItem = ({ id, message, type = 'success', onDismiss }) => {
  const config = toastVariants[type] || toastVariants.info;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      variants={motionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        'flex items-center gap-3 min-w-[300px] max-w-md',
        'px-4 py-3 rounded-xl shadow-premium text-white',
        config.className
      )}
    >
      <div className={cn('p-1.5 rounded-lg', config.iconBg)}>
        <Icon className="w-4 h-4" />
      </div>

      <p className="flex-1 text-sm font-medium">{message}</p>

      <button
        onClick={() => onDismiss(id)}
        className="p-1 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="Dismiss"
      >
        <FiX className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, dismissToast }) => {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            {...toast}
            onDismiss={dismissToast}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = TOAST_DURATION) => {
    const id = Date.now().toString();

    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const toast = useMemo(() => ({
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration),
    dismiss: dismissToast,
    clear: clearToasts,
  }), [addToast, dismissToast, clearToasts]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Default export is a simple component that just renders the container
// This is used in App.js for backwards compatibility
const Toast = () => null; // The actual container is rendered by ToastProvider

export default Toast;
