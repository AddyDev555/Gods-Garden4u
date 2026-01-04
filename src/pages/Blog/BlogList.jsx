import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import api from '../../api/gods-garden/axiosConfig';
import { SITE_NAME, SITE_URL } from '../../utils/constants';
import { formatDate, createSlug } from '../../utils/helpers';
import { BlogCardSkeleton } from '../../components/common/Skeleton/Skeleton';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/get-all-blogs/');
        setBlogs(response.data?.data || response.data || []);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <Helmet>
        <title>{`Blog | ${SITE_NAME}`}</title>
        <meta name="description" content={`Read our latest articles about organic food, healthy living, and recipes from ${SITE_NAME}.`} />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-12">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-neutral-900 mb-4">
              Our Blog
            </h1>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Discover tips, recipes, and insights about organic living
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => <BlogCardSkeleton key={i} />)}
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.article
                  key={blog.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-shadow"
                >
                  {blog.image && (
                    <Link to={`/blog/${blog.slug || createSlug(blog.title)}`}>
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full aspect-video object-cover"
                      />
                    </Link>
                  )}
                  <div className="p-6">
                    {blog.created && (
                      <p className="text-sm text-neutral-500 mb-2">
                        {formatDate(blog.created)}
                      </p>
                    )}
                    <Link to={`/blog/${blog.slug || createSlug(blog.title)}`}>
                      <h2 className="font-semibold text-lg text-neutral-900 hover:text-primary-600 mb-2">
                        {blog.title}
                      </h2>
                    </Link>
                    {blog.description && (
                      <p className="text-neutral-600 text-sm line-clamp-3">
                        {blog.description}
                      </p>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogList;
