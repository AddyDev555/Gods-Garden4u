import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FiPackage } from 'react-icons/fi';
import { SITE_NAME } from '../../utils/constants';
import Button from '../../components/common/Button/Button';

const Orders = () => {
  return (
    <>
      <Helmet>
        <title>My Orders | {SITE_NAME}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container-custom">
          <h1 className="font-display text-3xl font-bold text-neutral-900 mb-8">My Orders</h1>

          <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-10 h-10 text-neutral-400" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">No orders yet</h2>
            <p className="text-neutral-600 mb-6">Start shopping to see your orders here</p>
            <Button as={Link} to="/shop">Start Shopping</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
