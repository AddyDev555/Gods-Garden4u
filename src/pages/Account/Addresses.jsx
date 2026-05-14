import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FiMapPin, FiEdit2, FiPlus, FiX } from 'react-icons/fi';
import { SITE_NAME } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast/Toast';
import Button from '../../components/common/Button/Button';
import { Textarea } from '../../components/common/Input/Input';
import api from '../../api/gods-garden/axiosConfig';
import { storage } from '../../utils/helpers';
import { STORAGE_KEYS } from '../../utils/constants';

const Addresses = () => {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const hasAddress = Boolean(user?.address?.trim());
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: user?.address || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddForm = () => {
    setIsEditing(false);
    setFormData({ address: '' });
    setIsFormVisible(true);
  };

  const openEditForm = () => {
    setIsEditing(true);
    setFormData({ address: user?.address || '' });
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setIsFormVisible(false);
    setFormData({ address: user?.address || '' });
  };

  React.useEffect(() => {
    setFormData({ address: user?.address || '' });
  }, [user?.address]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.address.trim()) {
      toast.error('Please enter an address');
      return;
    }

    const userId = user?.id || user?.user_id || user?.pk || user?.uid;
    if (!userId) {
      toast.error('Unable to detect your user account. Please log in again.');
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isEditing ? '/edit-user-address/' : '/add-user-address/';
      const response = await api.post(endpoint, {
        user_id: userId,
        address: formData.address.trim(),
      });

      toast.success(response.data.message);

      // Update user context and local storage with new address
      const updatedUser = { ...user, address: response.data.address };
      setUser(updatedUser);
      storage.set(STORAGE_KEYS.USER, updatedUser);

      closeForm();
    } catch (error) {
      console.error('Address operation error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save address. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`My Addresses | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl font-bold text-neutral-900">My Addresses</h1>
            {!isFormVisible && (
            <Button onClick={openAddForm} className="flex items-center gap-2">
              <FiPlus className="w-4 h-4" />
              {hasAddress ? 'Edit Address' : 'Add Address'}
            </Button>
          )}
          </div>

          {!isFormVisible && hasAddress && (
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-neutral-900 mb-1">Default Address</h3>
                    <p className="text-neutral-600 whitespace-pre-line">{user.address}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openEditForm}
                  className="flex items-center gap-2"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit
                </Button>
              </div>
            </div>
          )}

          {!isFormVisible && !hasAddress && (
            <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="w-10 h-10 text-neutral-400" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">No addresses saved</h2>
              <p className="text-neutral-600 mb-6">Add an address for faster checkout</p>
              <Button onClick={openAddForm} className="flex items-center gap-2">
                <FiPlus className="w-4 h-4" />
                Add Address
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Address Form */}
      {isFormVisible && (
        <div className="absolute top-0 left-0 container-custom mt-8">
          <div className="bg-white rounded-2xl p-8 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                  {isEditing ? 'Edit Address' : 'Add Address'}
                </h2>
                <p className="text-neutral-500 text-sm">
                  {isEditing
                    ? 'Update your saved address below.'
                    : 'Enter the full address you want saved to your account.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Textarea
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Enter your full address including street, city, state, and PIN code"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeForm}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : (isEditing ? 'Update Address' : 'Add Address')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Addresses;
