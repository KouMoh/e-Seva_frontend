"use client";
import { useEffect, useState, useMemo } from 'react';
import api from '../../lib/api';
import TenderCard from '../../components/tenders/TenderCard';
import DateDisplay from '../../components/common/DateDisplay';

export default function BrowseTendersPage() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchTenders = async () => {
      try {
        const res = await fetch(api('tenders'));
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        if (mounted) setTenders(data);
      } catch (error) {
        console.error('Failed to fetch public tenders:', error);
        if (mounted) setTenders([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTenders();
    return () => { mounted = false; };
  }, []);

  // Show all tenders including awarded/granted on the public browse page
  const filteredTenders = useMemo(() => tenders, [tenders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tenders...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold">Discover Public Tenders</h1>
          <p className="mt-2 text-gray-600">A comprehensive list of tenders — historical and active — presented for reference.</p>
        </header>

        {filteredTenders.length === 0 ? (
          <p className="text-center text-gray-500">No tenders found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenders.map((t) => (
              <div key={t._id} className="transform hover:scale-105 transition-shadow">
                <TenderCard tender={t} statusBadge={t.status} DateDisplay={DateDisplay} allowApply={false} showDetails={false} showStatusBadge={false} variant="royal" />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
