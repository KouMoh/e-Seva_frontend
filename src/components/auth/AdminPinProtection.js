"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AdminPinProtection({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }
    
    if (session.user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    // Check if PIN is already verified in session
    const pinVerified = sessionStorage.getItem('adminPinVerified');
    if (pinVerified === 'true') {
      setIsVerified(true);
    }
  }, [session, status, router]);

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-admin-pin`, {
        pin: pin
      }, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });

      if (response.status === 200) {
        setIsVerified(true);
        sessionStorage.setItem('adminPinVerified', 'true');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid PIN');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Access Required
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please enter your admin PIN to continue
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handlePinSubmit}>
            <div>
              <label htmlFor="pin" className="sr-only">
                Admin PIN
              </label>
              <input
                id="pin"
                name="pin"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter admin PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify PIN'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Default admin PIN: <span className="font-mono bg-gray-100 px-2 py-1 rounded">123456</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return children;
}

