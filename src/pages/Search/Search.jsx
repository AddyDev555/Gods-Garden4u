import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FiSearch } from 'react-icons/fi';
import api from '../../api/gods-garden/axiosConfig';
import { SITE_NAME } from '../../utils/constants';
import ProductCard from '../../components/product/ProductCard/ProductCard';
import { ProductGridSkeleton } from '../../components/common/Skeleton/Skeleton';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
        setResults(response.data?.data || response.data || []);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <>
      <Helmet>
        <title>{`Search: ${query || 'Products'} | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-neutral-900">
              {query ? `Search results for "${query}"` : 'Search Products'}
            </h1>
            {!isLoading && (
              <p className="text-neutral-600 mt-2">
                {results.length} products found
              </p>
            )}
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-16">
              <FiSearch className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">No results found</h2>
              <p className="text-neutral-600">Try different keywords or browse our categories</p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Search;
