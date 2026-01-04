import React from 'react';
import { Helmet } from 'react-helmet';
import { SITE_NAME, SITE_URL, CONTACT_INFO } from '../../utils/constants';

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>{`Privacy Policy | ${SITE_NAME}`}</title>
        <meta name="description" content={`Privacy Policy for ${SITE_NAME}. Learn how we collect, use, and protect your personal information.`} />
        <link rel="canonical" href={`${SITE_URL}/privacy`} />
      </Helmet>

      <div className="bg-white py-12">
        <div className="container-narrow">
          <h1 className="font-display text-4xl font-bold text-neutral-900 mb-8">Privacy Policy</h1>

          <div className="prose prose-neutral max-w-none">
            <p className="text-neutral-600 mb-6">Last updated: January 2025</p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">1. Information We Collect</h2>
              <p className="text-neutral-600 mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                <li>Name, email address, and phone number</li>
                <li>Shipping and billing address</li>
                <li>Payment information (processed securely via Razorpay)</li>
                <li>Order history and preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Improve our website and services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">3. Information Sharing</h2>
              <p className="text-neutral-600">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2 mt-4">
                <li>Shipping partners to deliver your orders</li>
                <li>Payment processors for secure transactions</li>
                <li>Service providers who assist in our operations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">4. Data Security</h2>
              <p className="text-neutral-600">
                We implement appropriate security measures to protect your personal information.
                All payment transactions are encrypted using SSL technology.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">5. Contact Us</h2>
              <p className="text-neutral-600">
                If you have questions about this Privacy Policy, please contact us at{' '}
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

export default Privacy;
