// Centralized API base helper.
// Configure the backend base URL through NEXT_PUBLIC_API_BASE in Vercel or your .env.local.
// In development we default to localhost:5000 to make Next server-side fetches reach the local backend.
// In production we require NEXT_PUBLIC_API_BASE (or rely on same-origin if you proxy).
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '');

export default function api(path = '') {
  if (!path) return API_BASE;
  if (!path.startsWith('/')) path = '/' + path;
  return API_BASE ? `${API_BASE}${path}` : path;
}
