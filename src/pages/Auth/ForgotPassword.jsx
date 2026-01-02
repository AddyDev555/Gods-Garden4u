import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SITE_NAME } from '../../utils/constants';
import Button from '../../components/common/Button/Button';

const ForgotPassword = () => {
  return (
    <>
      <Helmet>
        <title>Forgot Password | {SITE_NAME}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center bg-neutral-50 py-12">
        <div className="w-full max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Reset Password</h1>
            <p className="text-neutral-600 mb-8">
              Password reset functionality will be available soon. Please contact support for assistance.
            </p>
            <Button as={Link} to="/login" fullWidth>
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
