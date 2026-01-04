import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SITE_NAME } from '../../utils/constants';

const OrderDetail = () => {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>{`Order #${id} | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container-custom">
          <h1 className="font-display text-3xl font-bold text-neutral-900 mb-8">
            Order #{id}
          </h1>
          <div className="bg-white rounded-2xl p-8 shadow-soft">
            <p className="text-neutral-600">Order details coming soon...</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
