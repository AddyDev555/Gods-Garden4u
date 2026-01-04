import React from 'react';
import { Helmet } from 'react-helmet';
import { SITE_NAME, SITE_URL, CONTACT_INFO } from '../../utils/constants';

const Cancellation = () => {
  return (
    <>
      <Helmet>
        <title>{`Cancellation Policy | ${SITE_NAME}`}</title>
        <meta name="description" content={`${SITE_NAME} order cancellation policy. Learn how to cancel your order and our cancellation guidelines.`} />
        <link rel="canonical" href={`${SITE_URL}/cancellation`} />
      </Helmet>

      <div className="bg-white py-12">
        <div className="container-narrow">
          <h1 className="font-display text-4xl font-bold text-neutral-900 mb-8">Cancellation Policy</h1>

          <div className="prose prose-neutral max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Order Cancellation</h2>
              <p className="text-neutral-600">
                You can cancel your order before it is dispatched. Once the order is shipped,
                cancellation is not possible, but you can initiate a return after delivery.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">How to Cancel</h2>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                <li>Contact us at {CONTACT_INFO.email} with your order ID</li>
                <li>Call us at {CONTACT_INFO.phone}</li>
                <li>Cancellation requests are processed within 24 hours</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Refund for Cancelled Orders</h2>
              <p className="text-neutral-600">
                For prepaid orders, the full amount will be refunded within 5-7 business days
                to your original payment method.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cancellation;
