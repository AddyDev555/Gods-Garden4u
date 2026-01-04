import React from 'react';
import { Helmet } from 'react-helmet';
import { FiMapPin } from 'react-icons/fi';
import { SITE_NAME } from '../../utils/constants';
import Button from '../../components/common/Button/Button';

const Addresses = () => {
  return (
    <>
      <Helmet>
        <title>{`My Addresses | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl font-bold text-neutral-900">My Addresses</h1>
            <Button>Add Address</Button>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMapPin className="w-10 h-10 text-neutral-400" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">No addresses saved</h2>
            <p className="text-neutral-600">Add an address for faster checkout</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Addresses;
