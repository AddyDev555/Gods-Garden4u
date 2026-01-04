import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FiPackage, FiSearch } from 'react-icons/fi';
import { SITE_NAME } from '../../utils/constants';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Track order logic would go here
  };

  return (
    <>
      <Helmet>
        <title>{`Track Order | ${SITE_NAME}`}</title>
        <meta name="description" content={`Track your ${SITE_NAME} order. Enter your order ID to check delivery status.`} />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-12">
        <div className="container-custom max-w-lg">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2">
              Track Your Order
            </h1>
            <p className="text-neutral-600">
              Enter your order ID to check delivery status
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-soft">
            <Input
              label="Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your order ID"
              leftIcon={<FiSearch />}
              className="mb-4"
            />

            <Button type="submit" fullWidth size="lg">
              Track Order
            </Button>

            <p className="text-sm text-neutral-500 text-center mt-4">
              You can find your order ID in the confirmation email we sent you.
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default TrackOrder;
