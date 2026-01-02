import React from 'react';
import { Helmet } from 'react-helmet';
import { SITE_NAME, SITE_URL, CONTACT_INFO } from '../../utils/constants';

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | {SITE_NAME}</title>
        <meta name="description" content={`Terms of Service for ${SITE_NAME}. Read our terms and conditions for using our website and services.`} />
        <link rel="canonical" href={`${SITE_URL}/terms`} />
      </Helmet>

      <div className="bg-white py-12">
        <div className="container-narrow">
          <h1 className="font-display text-4xl font-bold text-neutral-900 mb-8">Terms of Service</h1>

          <div className="prose prose-neutral max-w-none">
            <p className="text-neutral-600 mb-6">Last updated: January 2025</p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-neutral-600">
                By accessing and using {SITE_NAME}'s website, you accept and agree to be bound by these Terms of Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">2. Products and Pricing</h2>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                <li>All prices are listed in INR for India and USD for international customers</li>
                <li>Prices are subject to change without notice</li>
                <li>We reserve the right to limit quantities</li>
                <li>Product images are for illustration purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">3. Orders and Payment</h2>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                <li>All orders are subject to availability</li>
                <li>We accept payment via Razorpay and Cash on Delivery (India only)</li>
                <li>Payment must be received before order dispatch</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">4. Shipping</h2>
              <p className="text-neutral-600">
                Please refer to our Shipping Policy for detailed information about delivery times,
                shipping charges, and international shipping.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">5. Contact</h2>
              <p className="text-neutral-600">
                For questions about these terms, contact us at{' '}
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary-600 hover:underline">
                  {CONTACT_INFO.email}
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
