import { SITE_NAME, SITE_URL, CONTACT_INFO, SOCIAL_LINKS } from './constants';

/**
 * Generate Organization schema
 * @returns {object} Organization schema
 */
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  description: 'Gods Garden - Organic dehydrated Fruit Chips and Powder. Premium dehydrated fruits, vegetable powders, and natural snacks.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: CONTACT_INFO.phone,
    contactType: 'customer service',
    email: CONTACT_INFO.email,
    availableLanguage: ['English', 'Hindi'],
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dombivli',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  sameAs: SOCIAL_LINKS.map((link) => link.url),
});

/**
 * Generate WebSite schema with search
 * @returns {object} WebSite schema
 */
export const getWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

/**
 * Generate BreadcrumbList schema
 * @param {Array} items - Breadcrumb items [{name, url}]
 * @returns {object} BreadcrumbList schema
 */
export const getBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url ? `${SITE_URL}${item.url}` : undefined,
  })),
});

/**
 * Generate Product schema
 * @param {object} product - Product data
 * @param {string} currency - Currency code
 * @returns {object} Product schema
 */
export const getProductSchema = (product, currency = 'INR') => {
  if (!product) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.product_name,
    description: product.description || product.product_name,
    image: product.main_image,
    sku: product.product_code?.toString(),
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.slug || product.id}`,
      priceCurrency: currency,
      price: currency === 'USD'
        ? (product.offer_price / 83).toFixed(2)
        : product.offer_price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.quantity > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
  };

  // Add aggregate rating if reviews exist
  if (product.rating && product.rating !== '0') {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      bestRating: '5',
      worstRating: '1',
      ratingCount: product.review_count || 1,
    };
  }

  return schema;
};

/**
 * Generate Product with multiple offers (sizes)
 * @param {object} product - Product data
 * @param {string} currency - Currency code
 * @returns {object} Product schema with offers
 */
export const getProductWithOffersSchema = (product, currency = 'INR') => {
  if (!product || !product.pricing) return getProductSchema(product, currency);

  const offers = Object.entries(product.pricing).map(([size, [mrp, offerPrice, quantity]]) => ({
    '@type': 'Offer',
    name: `${product.product_name} - ${size}`,
    priceCurrency: currency,
    price: currency === 'USD' ? (offerPrice / 83).toFixed(2) : offerPrice,
    availability: quantity > 0
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    seller: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.product_name,
    description: product.description || product.product_name,
    image: product.main_image,
    sku: product.product_code?.toString(),
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: currency,
      lowPrice: Math.min(...offers.map((o) => parseFloat(o.price))),
      highPrice: Math.max(...offers.map((o) => parseFloat(o.price))),
      offerCount: offers.length,
      offers,
    },
  };
};

/**
 * Generate Article/BlogPosting schema
 * @param {object} article - Article data
 * @returns {object} Article schema
 */
export const getArticleSchema = (article) => {
  if (!article) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${article.slug}`,
    },
    headline: article.title,
    description: article.description || article.title,
    image: article.image,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    datePublished: article.created,
    dateModified: article.modified || article.created,
  };
};

/**
 * Generate FAQ schema
 * @param {Array} faqs - FAQ items [{question, answer}]
 * @returns {object} FAQPage schema
 */
export const getFAQSchema = (faqs) => {
  if (!faqs || !faqs.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

/**
 * Generate LocalBusiness schema
 * @returns {object} LocalBusiness schema
 */
export const getLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE_NAME,
  image: `${SITE_URL}/images/store.jpg`,
  '@id': SITE_URL,
  url: SITE_URL,
  telephone: CONTACT_INFO.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: CONTACT_INFO.address,
    addressLocality: 'Dombivli',
    addressRegion: 'Maharashtra',
    postalCode: '421201',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 19.2183,
    longitude: 73.0878,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '21:00',
    },
  ],
  priceRange: '₹₹',
});

/**
 * Generate Review schema
 * @param {object} review - Review data
 * @param {object} product - Product data
 * @returns {object} Review schema
 */
export const getReviewSchema = (review, product) => ({
  '@context': 'https://schema.org',
  '@type': 'Review',
  itemReviewed: {
    '@type': 'Product',
    name: product?.product_name || 'Product',
  },
  reviewRating: {
    '@type': 'Rating',
    ratingValue: review.rating,
    bestRating: '5',
    worstRating: '1',
  },
  author: {
    '@type': 'Person',
    name: review.name || 'Customer',
  },
  reviewBody: review.review,
  datePublished: review.created,
});

/**
 * Generate ItemList schema (for category pages)
 * @param {Array} products - List of products
 * @param {string} listName - Name of the list
 * @returns {object} ItemList schema
 */
export const getItemListSchema = (products, listName = 'Products') => {
  if (!products || !products.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.product_name,
        image: product.main_image,
        url: `${SITE_URL}/product/${product.slug || product.id}`,
        offers: {
          '@type': 'Offer',
          price: product.offer_price,
          priceCurrency: 'INR',
        },
      },
    })),
  };
};

/**
 * Serialize schema to JSON-LD script tag content
 * @param {object|Array} schema - Schema object(s)
 * @returns {string} JSON string
 */
export const serializeSchema = (schema) => {
  if (!schema) return '';
  return JSON.stringify(Array.isArray(schema) ? schema : schema);
};

/**
 * Create combined schemas for a page
 * @param {Array} schemas - Array of schema objects
 * @returns {Array} Combined schemas (filtered)
 */
export const combineSchemas = (...schemas) => {
  return schemas.filter(Boolean);
};
