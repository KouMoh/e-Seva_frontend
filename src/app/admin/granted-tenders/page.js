"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { authenticatedApiCall } from '../../../lib/api';
import TenderCard from '../../../components/tenders/TenderCard';
import DateDisplay from '../../../components/common/DateDisplay';

export default function AdminGrantedTendersPage() {
  const { data: session } = useSession();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenders = async () => {
      if (!session?.accessToken) return;
      
      try {
        const tendersData = await authenticatedApiCall('tenders', { method: 'GET' }, session.accessToken);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading granted tenders...</p>
        </div>
      </div>
    );
  }

  const granted = tenders.filter(t => t.status === 'awarded');
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">All Granted Tenders</h1>
      {granted.length === 0 ? (
        <p>No granted tenders found.</p>
      ) : (
        <ul className="grid gap-4">
          {granted.map(t => (
            <li key={t._id}>
              <TenderCard tender={t} statusBadge={t.status} DateDisplay={DateDisplay} userRole="admin" />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
