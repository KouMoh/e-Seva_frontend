"use client";
import { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { authenticatedApiCall } from '../../lib/api';
import TenderCard from '../../components/tenders/TenderCard';
import DateDisplay from '../../components/common/DateDisplay';
import { recommendTenders } from '../../lib/recommendationEngine';

export default function TendersPage() {
  const { data: session } = useSession();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const tendersData = await authenticatedApiCall('tenders', { method: 'GET' }, session?.accessToken);
        setTenders(tendersData);
      } catch (error) {
        console.error('Failed to fetch tenders:', error);
        setTenders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, [session?.accessToken]);

  // Show all open tenders for browsing
  const filteredTenders = useMemo(() => {
    return tenders.filter(t => t.status !== 'awarded');
  }, [tenders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tenders...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Browse Tenders</h1>
      {filteredTenders.length === 0 ? (
        <p>No open tenders found.</p>
      ) : (
        <ul className="grid gap-4">
          {filteredTenders.map((t) => (
            <li key={t._id}>
              <TenderCard tender={t} statusBadge={t.status} DateDisplay={DateDisplay} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
