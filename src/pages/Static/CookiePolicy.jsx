import React from 'react';
import { Helmet } from 'react-helmet';
import { SITE_NAME, SITE_URL } from '../../utils/constants';

const CookiePolicy = () => {
  return (
    <>
      <Helmet>
        <title>{`Cookie Policy | ${SITE_NAME}`}</title>
        <meta name="description" content={`${SITE_NAME} cookie policy. Learn about how we use cookies on our website.`} />
        <link rel="canonical" href={`${SITE_URL}/cookies`} />
      </Helmet>

      <div className="bg-white py-12">
        <div className="container-narrow">
          <h1 className="font-display text-4xl font-bold text-neutral-900 mb-8">Cookie Policy</h1>

          <div className="prose prose-neutral max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">What Are Cookies</h2>
              <p className="text-neutral-600">
                Cookies are small text files stored on your device when you visit our website.
                They help us provide a better browsing experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">How We Use Cookies</h2>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for website functionality (cart, login)</li>
                <li><strong>Preference Cookies:</strong> Remember your currency and language settings</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Managing Cookies</h2>
              <p className="text-neutral-600">
                You can control cookies through your browser settings. Note that disabling some
                cookies may affect website functionality.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy;
