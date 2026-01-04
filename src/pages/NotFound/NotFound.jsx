import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { SITE_NAME } from '../../utils/constants';
import Button from '../../components/common/Button/Button';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>{`Page Not Found | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center bg-neutral-50 py-16">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="text-[120px] mb-4">🌿</div>
            <h1 className="font-display text-4xl font-bold text-neutral-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-neutral-600 mb-8">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button as={Link} to="/" size="lg">
                Go Home
              </Button>
              <Button as={Link} to="/shop" variant="outline" size="lg">
                Browse Products
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
