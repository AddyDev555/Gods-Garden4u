import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiAward, FiHeart, FiGlobe, FiUsers } from 'react-icons/fi';
import { SITE_NAME, SITE_URL } from '../../utils/constants';
import { getOrganizationSchema, serializeSchema } from '../../utils/structuredData';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const AboutUs = () => {
  const values = [
    { icon: FiAward, title: 'Quality First', description: 'We source only the finest organic ingredients from trusted farms.' },
    { icon: FiHeart, title: 'Customer Love', description: 'Your satisfaction is our top priority, always.' },
    { icon: FiGlobe, title: 'Sustainability', description: 'Committed to eco-friendly practices and sustainable farming.' },
    { icon: FiUsers, title: 'Community', description: 'Supporting local farmers and building lasting relationships.' },
  ];

  return (
    <>
      <Helmet>
        <title>{`About Us | ${SITE_NAME}`}</title>
        <meta name="description" content={`Learn about ${SITE_NAME} - our story, mission, and commitment to bringing you premium organic products.`} />
        <link rel="canonical" href={`${SITE_URL}/about`} />
        <script type="application/ld+json">{serializeSchema(getOrganizationSchema())}</script>
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container-custom text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              Our Story
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              About Gods Garden
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Gods Garden offers premium dehydrated fruits, vegetable powders, and natural snacks
              made without artificial preservatives. We focus on healthy, hygienic, and nutritious
              products for everyday consumption.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl font-bold text-neutral-900 mb-6">
                Our Journey
              </h2>
              <div className="space-y-4 text-neutral-600">
                <p>
                  Gods Garden was born from a simple belief: everyone deserves access to pure,
                  natural, and nutritious food. We started our journey in Dombivli, Maharashtra,
                  with a passion for healthy snacking and wholesome eating.
                </p>
                <p>
                  We specialize in premium dehydrated fruit chips, vegetable powders, and natural
                  snacks. Every product is carefully crafted without artificial preservatives,
                  ensuring you get only the best that nature has to offer.
                </p>
                <p>
                  Our promise is simple: healthy, hygienic, and nutritious products made with
                  care and delivered fresh to your doorstep.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl p-8 flex items-center justify-center min-h-[400px]"
            >
              <span className="text-[150px]">🌿</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-neutral-900 mb-4">
              Our Values
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              These core values guide everything we do
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 text-center shadow-soft"
                >
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-neutral-900 mb-2">{value.title}</h3>
                  <p className="text-neutral-600 text-sm">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
