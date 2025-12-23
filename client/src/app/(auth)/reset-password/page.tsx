'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyResetToken, resetPassword } from './api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<
    'weak' | 'medium' | 'strong' | null
  >(null);

  // Verify token on component mount
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setError('No reset token provided');
        setIsVerifying(false);
        return;
      }

      try {
        await verifyResetToken(token);
        setIsTokenValid(true);
      } catch (err: any) {
        setError(err.message || 'Invalid or expired reset link');
        setIsTokenValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    checkToken();
  }, [token]);

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    const strength =
      [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, isLongEnough].filter(
        Boolean
      ).length;

    if (strength <= 2) setPasswordStrength('weak');
    else if (strength <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword(token, password);
      setMessage(response.message || 'Password reset successful!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while verifying token
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Invalid or Expired Link
            </h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={() => router.push('/forgot-password')}
              className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Reset Your Password</h2>
          <p className="mt-2 text-gray-600">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter new password"
            />
            
            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        passwordStrength === 'weak'
                          ? 'w-1/3 bg-red-500'
                          : passwordStrength === 'medium'
                          ? 'w-2/3 bg-yellow-500'
                          : 'w-full bg-green-500'
                      }`}
                    ></div>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength === 'weak'
                        ? 'text-red-600'
                        : passwordStrength === 'medium'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {passwordStrength?.toUpperCase()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Use 8+ characters with a mix of letters, numbers & symbols
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Confirm new password"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || password !== confirmPassword}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Resetting Password...
              </div>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/login')}
            className="text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}