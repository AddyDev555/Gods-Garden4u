import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../../context/WishlistContext';
import { SITE_NAME } from '../../utils/constants';
import Button from '../../components/common/Button/Button';

const Wishlist = () => {
  const { wishlistCount } = useWishlist();

  return (
    <>
      <Helmet>
        <title>Wishlist | {SITE_NAME}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container-custom">
          <h1 className="font-display text-3xl font-bold text-neutral-900 mb-8">
            My Wishlist ({wishlistCount} items)
          </h1>

          {wishlistCount === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart className="w-10 h-10 text-neutral-400" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Your wishlist is empty</h2>
              <p className="text-neutral-600 mb-6">Save items you love for later</p>
              <Button as={Link} to="/shop">Explore Products</Button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <p className="text-neutral-600">
                {wishlistCount} items in your wishlist. Product cards will be displayed here.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
