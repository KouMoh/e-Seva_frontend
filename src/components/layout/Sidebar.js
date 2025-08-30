"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useState } from 'react';

export default function Sidebar({ role = 'company' }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    try { localStorage.removeItem('currentUser'); } catch(e){}
    router.push('/');
  };

  if (collapsed) {
    // When collapsed we only render a small fixed-position toggle button so the layout
    // does not reserve space for the sidebar and main content won't be overlaid.
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed left-3 top-3 z-50 p-2 bg-blue-600 text-white rounded focus:outline-none"
        title="Open sidebar"
      >
        ☰
      </button>
    );
  }

  // Expanded: participate in layout (not fixed) so the parent flex container can
  // push the main content to the right and avoid overlay.
  return (
    <aside className={`bg-white border-r min-h-screen transition-all duration-200 w-64 p-4`}>
      <div className="flex items-center justify-between mb-6">
        <span className="font-bold">E-Suvidha</span>
        <button onClick={() => setCollapsed(true)} className="text-gray-500 text-xl focus:outline-none" title="Collapse sidebar">✕</button>
      </div>
      <nav className={`flex flex-col gap-2 text-sm text-gray-700`}>
        {role === 'admin' ? (
          <>
            <Link href="/admin/dashboard" className="font-semibold">Dashboard</Link>
            <Link href="/admin/tenders">Manage Tenders</Link>
            <Link href="/admin/bids">View Bids</Link>
            <Link href="/admin/create-tender">Create Tender</Link>
            <Link href="/admin/granted-tenders">Granted Tenders</Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="font-semibold">Dashboard</Link>
            <Link href="/tenders">Browse Tenders</Link>
            <Link href="/my-bids">My Bids</Link>
            <Link href="/granted-tenders">Granted Tenders</Link>
            <Link href="/profile">Profile</Link>
          </>
        )}
        <button
          onClick={logout}
          className="text-red-600 text-left mt-4 transition-colors duration-150 hover:text-white hover:bg-red-600 rounded px-2 py-1 focus:outline-none cursor-pointer"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
