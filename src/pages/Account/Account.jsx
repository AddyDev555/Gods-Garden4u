import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FiPackage, FiMapPin, FiHeart, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast/Toast';
import { SITE_NAME } from '../../utils/constants';

const Account = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const menuItems = [
    { icon: FiPackage, label: 'My Orders', path: '/account/orders' },
    { icon: FiMapPin, label: 'Addresses', path: '/account/addresses' },
    { icon: FiHeart, label: 'Wishlist', path: '/wishlist' },
  ];

  return (
    <>
      <Helmet>
        <title>{`My Account | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container-custom">

          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-neutral-900">
                      {user?.first_name} {user?.last_name}
                    </h2>
                    <p className="text-neutral-500 text-sm">{user?.email}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 text-sm text-neutral-600">
                  <div className="flex justify-between gap-4">
                    <span className="font-medium text-neutral-700">Mobile</span>
                    <span>{user?.mobile_number || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium text-neutral-700">Status</span>
                    <span className="text-primary-600">Active</span>
                  </div>
                </div>

                <div className="grid gap-3 mb-6">
                  <Link
                    to="/account/orders"
                    className="block text-center px-4 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
                  >
                    Track My Orders
                  </Link>
                  <Link
                    to="/account/addresses"
                    className="block text-center px-4 py-3 rounded-xl border border-neutral-200 text-neutral-700 hover:border-primary-500 hover:text-primary-600 transition-colors"
                  >
                    Manage Addresses
                  </Link>
                </div>

                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-50 text-neutral-700 transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <hr className="my-4" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-error-50 text-error-600 transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <h2 className="font-semibold text-lg mb-6">Quick Actions</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-4 p-4 border border-neutral-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-colors"
                      >
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{item.label}</p>
                          <p className="text-sm text-neutral-500">
                            {item.label === 'My Orders' && 'View order history'}
                            {item.label === 'Addresses' && 'Manage addresses'}
                            {item.label === 'Wishlist' && 'Saved items'}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
