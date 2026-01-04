import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import api from '../../api/gods-garden/axiosConfig';
import { SITE_NAME, SITE_URL } from '../../utils/constants';
import { getFAQSchema, serializeSchema } from '../../utils/structuredData';
import { cn } from '../../utils/helpers';

const defaultFaqs = [
  { question: 'Are your products 100% organic?', answer: 'Yes, all our products are certified organic, sourced directly from trusted organic farms across India.' },
  { question: 'What is your shipping policy?', answer: 'We offer free shipping on orders above ₹499 within India. International shipping is available with costs calculated at checkout.' },
  { question: 'How can I track my order?', answer: 'Once your order is shipped, you will receive a tracking number via email. You can also track on our website.' },
  { question: 'What is your return policy?', answer: 'We accept returns within 7 days of delivery for unopened products in original packaging.' },
  { question: 'Do you ship internationally?', answer: 'Yes, we ship to most countries worldwide. International shipping costs and delivery times vary by location.' },
];

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await api.get('/faqs/');
        setFaqs(response.data?.data || response.data || defaultFaqs);
      } catch (error) {
        setFaqs(defaultFaqs);
      }
    };

    fetchFaqs();
  }, []);

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <>
      <Helmet>
        <title>{`Frequently Asked Questions | ${SITE_NAME}`}</title>
        <meta name="description" content={`Find answers to common questions about ${SITE_NAME} products, shipping, returns, and more.`} />
        <link rel="canonical" href={`${SITE_URL}/faq`} />
        <script type="application/ld+json">{serializeSchema(getFAQSchema(displayFaqs))}</script>
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-12">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-neutral-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-neutral-600">
              Can't find what you're looking for? Contact our support team.
            </p>
          </div>

          <div className="space-y-4">
            {displayFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-soft overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-medium text-neutral-900 pr-4">{faq.question}</span>
                  <FiChevronDown
                    className={cn(
                      'w-5 h-5 text-neutral-500 transition-transform flex-shrink-0',
                      openIndex === index && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 text-neutral-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
