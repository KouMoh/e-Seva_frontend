// Centralized API base helper with authentication support.
// Configure the backend base URL through NEXT_PUBLIC_API_URL in Vercel or your .env.local.
// In development we default to localhost:5000 to make Next server-side fetches reach the local backend.
// In production we require NEXT_PUBLIC_API_URL (or rely on same-origin if you proxy).
const API_BASE = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : '');

export default function api(path = '') {
  if (!path) return API_BASE;
  
  // Remove leading slash if present to avoid double slashes
  if (path.startsWith('/')) {
    path = path.substring(1);
  }
  
  // If path already starts with 'api/', remove it to avoid double 'api'
  if (path.startsWith('api/')) {
    path = path.substring(4);
  }
  
  return API_BASE ? `${API_BASE}/${path}` : `/${path}`;
}

// Helper function to create authenticated API requests
export function createAuthenticatedRequest(token) {
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
}

// Helper function for authenticated API calls
export async function authenticatedApiCall(path, options = {}, token) {
  const url = api(path);
  const requestOptions = {
    ...options,
    headers: {
      ...createAuthenticatedRequest(token).headers,
      ...options.headers
    }
  };
  
  const response = await fetch(url, requestOptions);
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}