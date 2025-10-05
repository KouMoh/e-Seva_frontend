"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { authenticatedApiCall } from '../../lib/api';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!session?.accessToken) {
        console.log('No access token available');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching user details with token:', session.accessToken.substring(0, 20) + '...');
        // Fetch detailed user information from backend
        const userData = await authenticatedApiCall('auth/profile', { method: 'GET' }, session.accessToken);
        console.log('User data received:', userData);
        setUserDetails(userData);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        setError('Failed to load profile details: ' + (error.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [session?.accessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const user = userDetails || session?.user || {};

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">View and manage your account information</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {user.name || 'Not provided'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {user.email || 'Not provided'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'company' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Account Status</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Company Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {user.company || 'Not provided'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {user.location || 'Not provided'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Company Description</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md min-h-[100px]">
                  {user.description || 'No description provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Account Activity */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Account Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Created</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Not available'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Login</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Never logged in'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Not available'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">User ID</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md font-mono text-xs">
                  {user._id || 'Not available'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Edit Profile
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}






