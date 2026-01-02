import React from 'react';
import { Helmet } from 'react-helmet';
import { SITE_NAME, SITE_URL, CONTACT_INFO } from '../../utils/constants';

const Returns = () => {
  return (
    <>
      <Helmet>
        <title>Return & Refund Policy | {SITE_NAME}</title>
        <meta name="description" content={`${SITE_NAME} return and refund policy. Learn about our easy return process and refund guidelines.`} />
        <link rel="canonical" href={`${SITE_URL}/returns`} />
      </Helmet>

      <div className="bg-white py-12">
        <div className="container-narrow">
          <h1 className="font-display text-4xl font-bold text-neutral-900 mb-8">Return & Refund Policy</h1>

          <div className="prose prose-neutral max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Return Window</h2>
              <p className="text-neutral-600">
                We accept returns within 7 days of delivery for most products. Items must be
                unopened and in original packaging.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Non-Returnable Items</h2>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                <li>Opened or used products</li>
                <li>Perishable goods</li>
                <li>Products without original packaging</li>
                <li>Sale or discounted items</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">How to Initiate a Return</h2>
              <ol className="list-decimal pl-6 text-neutral-600 space-y-2">
                <li>Contact us at {CONTACT_INFO.email} with your order ID</li>
                <li>Provide reason for return and photos if applicable</li>
                <li>Wait for return authorization</li>
                <li>Ship the item back to us</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Refund Process</h2>
              <p className="text-neutral-600">
                Refunds are processed within 5-7 business days after we receive the returned item.
                The amount will be credited to your original payment method.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Damaged or Wrong Items</h2>
              <p className="text-neutral-600">
                If you receive a damaged or incorrect item, please contact us immediately. We will
                arrange for a replacement or full refund at no additional cost.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Returns;
