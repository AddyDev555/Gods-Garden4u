import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast/Toast';
import { SITE_NAME } from '../../utils/constants';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import { Checkbox } from '../../components/common/Input/Input';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    if (form.mobileNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    const result = await register(form);
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Create Account | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center bg-neutral-50 py-12">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <span className="text-3xl">🌿</span>
                <span className="font-display font-semibold text-2xl text-primary-600">
                  {SITE_NAME}
                </span>
              </Link>
              <h1 className="text-2xl font-bold text-neutral-900">Create Account</h1>
              <p className="text-neutral-600 mt-2">Join our community</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <Input
                label="Mobile Number"
                type="tel"
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={(e) => setForm((prev) => ({
                  ...prev,
                  mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10),
                }))}
                placeholder="10-digit mobile number"
                maxLength={10}
                required
              />

              <Checkbox
                name="agreeTerms"
                checked={form.agreeTerms}
                onChange={handleChange}
                label={
                  <>
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary-600 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </>
                }
              />

              <Button
                type="submit"
                loading={isLoading}
                fullWidth
                size="lg"
              >
                Create Account
              </Button>
            </form>

            <p className="text-center text-sm text-neutral-600 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
