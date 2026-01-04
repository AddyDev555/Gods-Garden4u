import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast/Toast';
import { SITE_NAME } from '../../utils/constants';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const toast = useToast();

  const [mobileNumber, setMobileNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mobileNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    const result = await login(mobileNumber);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Login | ${SITE_NAME}`}</title>
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
              <h1 className="text-2xl font-bold text-neutral-900">Welcome Back</h1>
              <p className="text-neutral-600 mt-2">Login to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Mobile Number"
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                required
              />

              <Button
                type="submit"
                loading={isLoading}
                fullWidth
                size="lg"
              >
                Continue
              </Button>
            </form>

            <p className="text-center text-sm text-neutral-600 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
