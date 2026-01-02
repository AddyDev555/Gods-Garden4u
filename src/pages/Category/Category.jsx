import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SITE_NAME } from '../../utils/constants';
import { titleCase } from '../../utils/helpers';

const Category = () => {
  const { slug } = useParams();
  const categoryName = titleCase(slug?.replace(/-/g, ' ') || 'Category');

  return (
    <>
      <Helmet>
        <title>{categoryName} | {SITE_NAME}</title>
        <meta name="description" content={`Shop our collection of ${categoryName.toLowerCase()} products.`} />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen">
        <div className="bg-white border-b border-neutral-200">
          <div className="container-custom py-8">
            <h1 className="font-display text-3xl font-bold text-neutral-900">
              {categoryName}
            </h1>
            <p className="text-neutral-600 mt-2">
              Explore our premium {categoryName.toLowerCase()} collection
            </p>
          </div>
        </div>

        <div className="container-custom py-12">
          <div className="text-center">
            <p className="text-lg text-neutral-600">Products coming soon...</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;
