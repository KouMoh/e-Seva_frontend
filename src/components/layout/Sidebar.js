"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Sidebar({ role = 'company' }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    update();
    mq.addEventListener ? mq.addEventListener('change', update) : mq.addListener(update);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', update) : mq.removeListener(update);
    };
  }, []);

  const logout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Use session role if available, otherwise fallback to prop
  const userRole = session?.user?.role || role;

  // Width-collapsing sidebar; mobile defaults to collapsed and uses overlay when open
  return (
    <>
    {isMobile && !collapsed && (
      <div className="fixed inset-0 bg-black/30 z-30" onClick={() => setCollapsed(true)} />
    )}
    <aside className={`${collapsed ? (isMobile ? 'w-0 p-0' : 'w-14 p-2') : 'w-64 p-4'} ${isMobile ? 'fixed left-0 top-0 h-full z-40' : ''} bg-white border-r min-h-screen transition-all duration-300 ease-in-out overflow-hidden`}> 
      <div className="flex items-center justify-between mb-6">
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white bg-blue-600 rounded p-2 focus:outline-none"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            ☰
          </button>
        )}
        {!collapsed && <span className="font-bold">E-Suvidha</span>}
      </div>
      <nav className={`flex flex-col gap-2 text-sm text-gray-700`}>
        {userRole === 'admin' ? (
          <>
            <Link href="/admin/dashboard" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className={`${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>Dashboard</span>
            </Link>
            <Link href="/admin/tenders" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className={`${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>Manage Tenders</span>
            </Link>
            <Link href="/admin/bids" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className={`${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>View Bids</span>
            </Link>
            <Link href="/admin/create-tender" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className={`${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>Create Tender</span>
            </Link>
            <Link href="/admin/granted-tenders" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className={`${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>Granted Tenders</span>
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className={`${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>Dashboard</span>
            </Link>
            <Link href="/tenders" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className={`${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>Browse Tenders</span>
            </Link>
            <Link href="/my-bids" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className={`${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>My Bids</span>
            </Link>
            <Link href="/granted-tenders" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className={`${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>Granted Tenders</span>
            </Link>
            <Link href="/profile" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className={`${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>Profile</span>
            </Link>
          </>
        )}
        {session && !collapsed && (
          <div className="mt-4 p-2 bg-gray-50 rounded">
            <p className="text-xs font-medium text-gray-900">{session.user.name}</p>
            <p className="text-xs text-gray-600">{session.user.email}</p>
            <p className="text-xs text-blue-600 capitalize">{session.user.role}</p>
          </div>
        )}
        <button
          onClick={logout}
          className={`text-left mt-4 transition-colors duration-150 rounded px-2 py-1 focus:outline-none cursor-pointer hover:text-white hover:bg-red-600 ${collapsed ? 'text-red-600' : 'text-red-600'}`}
          title="Logout"
        >
          <span className={`${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>Logout</span>
        </button>
      </nav>
    </aside>
    {isMobile && collapsed && (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed left-3 top-3 z-50 p-2 bg-blue-600 text-white rounded focus:outline-none"
        title="Open sidebar"
      >
        ☰
      </button>
    )}
    </>
  );
}
