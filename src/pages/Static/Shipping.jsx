import React from 'react';
import { Helmet } from 'react-helmet';
import { SITE_NAME, SITE_URL } from '../../utils/constants';

const Shipping = () => {
  return (
    <>
      <Helmet>
        <title>Shipping Policy | {SITE_NAME}</title>
        <meta name="description" content={`${SITE_NAME} shipping policy. Learn about delivery times, shipping costs, and international shipping options.`} />
        <link rel="canonical" href={`${SITE_URL}/shipping`} />
      </Helmet>

      <div className="bg-white py-12">
        <div className="container-narrow">
          <h1 className="font-display text-4xl font-bold text-neutral-900 mb-8">Shipping Policy</h1>

          <div className="prose prose-neutral max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Domestic Shipping (India)</h2>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                <li><strong>Free Shipping:</strong> On orders above ₹499</li>
                <li><strong>Standard Shipping:</strong> ₹39 for orders below ₹499</li>
                <li><strong>Delivery Time:</strong> 3-7 business days</li>
                <li><strong>Cash on Delivery:</strong> Available (additional ₹39 COD charges)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">International Shipping</h2>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                <li>We ship to most countries worldwide</li>
                <li>Shipping costs calculated at checkout based on destination</li>
                <li>Delivery Time: 7-21 business days depending on location</li>
                <li>International customers may be responsible for customs duties</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Order Processing</h2>
              <p className="text-neutral-600">
                Orders are processed within 1-2 business days. You will receive a tracking number
                once your order is dispatched.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Tracking Your Order</h2>
              <p className="text-neutral-600">
                Track your order status using the tracking link sent to your email, or visit our
                Track Order page with your order ID.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shipping;
