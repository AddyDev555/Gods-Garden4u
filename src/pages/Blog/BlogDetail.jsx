import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import api from '../../api/axiosConfig';
import { SITE_NAME, SITE_URL } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import { getArticleSchema, getBreadcrumbSchema, serializeSchema } from '../../utils/structuredData';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/get-blog-detail/?slug=${slug}`);
        setBlog(response.data?.data || response.data);
      } catch (error) {
        console.error('Failed to fetch blog:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container-narrow py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-3/4" />
          <div className="h-4 bg-neutral-200 rounded w-1/4" />
          <div className="h-64 bg-neutral-200 rounded" />
          <div className="space-y-2">
            <div className="h-4 bg-neutral-200 rounded" />
            <div className="h-4 bg-neutral-200 rounded" />
            <div className="h-4 bg-neutral-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container-narrow py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Article Not Found</h1>
        <Link to="/blog" className="text-primary-600 hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: blog.title },
  ];

  return (
    <>
      <Helmet>
        <title>{blog.title} | {SITE_NAME}</title>
        <meta name="description" content={blog.description || blog.title} />
        <link rel="canonical" href={`${SITE_URL}/blog/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.title} />
        <meta property="og:image" content={blog.image} />
        <script type="application/ld+json">
          {serializeSchema([getArticleSchema(blog), getBreadcrumbSchema(breadcrumbs)])}
        </script>
      </Helmet>

      <article className="bg-white py-12">
        <div className="container-narrow">
          {/* Breadcrumbs */}
          <nav className="text-sm text-neutral-500 mb-6">
            {breadcrumbs.map((crumb, i) => (
              <span key={i}>
                {crumb.url ? (
                  <Link to={crumb.url} className="hover:text-primary-600">{crumb.name}</Link>
                ) : (
                  <span className="text-neutral-900">{crumb.name}</span>
                )}
                {i < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
              </span>
            ))}
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              {blog.title}
            </h1>
            {blog.created && (
              <p className="text-neutral-500">{formatDate(blog.created)}</p>
            )}
          </header>

          {/* Featured Image */}
          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full rounded-2xl mb-8"
            />
          )}

          {/* Content */}
          <div className="prose prose-neutral max-w-none">
            {blog.description && (
              <p className="text-lg text-neutral-600 mb-6">{blog.description}</p>
            )}
            {blog.content && (
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            )}
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogDetail;
