"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import StatCard from '../../../components/dashboard/StatCard';
import { authenticatedApiCall } from '../../../lib/api';
import DateDisplay from '../../../components/common/DateDisplay';
import TenderCard from '../../../components/tenders/TenderCard';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [tenders, setTenders] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchData = async () => {
      try {
        const [tendersData, bidsData] = await Promise.all([
          authenticatedApiCall('tenders', { method: 'GET' }, session.accessToken),
          authenticatedApiCall('bids', { method: 'GET' }, session.accessToken)
        ]);
        setTenders(tendersData);
        setBids(bidsData);
      } catch (error) {
        console.error('Failed to fetch admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.accessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const totalUsers = 42; // placeholder
  const totalTenders = tenders.length;
  const totalBids = bids.length;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Registered Users" value={totalUsers} />
        <StatCard title="Total Tenders Live" value={totalTenders} />
        <StatCard title="Total Bids Submitted" value={totalBids} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Recent Tenders</h2>
        <div className="grid gap-4">
          {tenders.filter(t => t.status !== 'awarded').slice(0,5).map(t => (
            <TenderCard key={t._id} tender={t} DateDisplay={DateDisplay} userRole="admin" />
          ))}
        </div>
      </section>
    </main>
  );
}
