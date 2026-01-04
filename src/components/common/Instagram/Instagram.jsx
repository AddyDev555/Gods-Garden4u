import React, { useState, useEffect } from 'react';
import { FiInstagram } from 'react-icons/fi';
import { getInstagramProfile } from '../../../api/productApi';

const InstagramFeed = ({ limit = 6, className = '' }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      setIsLoading(true);
      try {
        const data = await getInstagramProfile();
        setPosts(data.slice(0, limit));
      } catch (err) {
        console.error('Failed to fetch Instagram posts:', err);
        setError('Failed to load Instagram feed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstagramPosts();
  }, [limit]);

  if (error) {
    return null; // Silently fail - Instagram feed is not critical
  }

  if (isLoading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {[...Array(limit)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-neutral-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiInstagram className="w-5 h-5 text-pink-500" />
          <span className="font-medium text-neutral-900">Follow us on Instagram</span>
        </div>
        <a
          href="https://instagram.com/godsgarden"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          @godsgarden
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {posts.map((post, index) => (
          <a
            key={index}
            href={post.navigate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-100"
          >
            <img
              src={post.media}
              alt={`Instagram post ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <FiInstagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default InstagramFeed;
