"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import TenderCard from '../../components/tenders/TenderCard';
import { authenticatedApiCall } from '../../lib/api';
import NotificationList from '../../components/notifications/NotificationList';
import DateDisplay from '../../components/common/DateDisplay';

export default function MyBidsPage() {
  const { data: session } = useSession();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchBids = async () => {
      try {
        const bidsData = await authenticatedApiCall('bids/my-bids', { method: 'GET' }, session.accessToken);
        setBids(bidsData);
      } catch (error) {
        console.error('Failed to fetch bids:', error);
        setBids([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [session?.accessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bids...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2">
        <h1 className="text-2xl font-bold mb-4">My Bids</h1>
        {bids.length === 0 && <p className="text-gray-600">No bids yet.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bids.map((bid) => (
            <div key={bid._id} className="p-4 border rounded">
              <h2 className="font-semibold">{bid.bidderName} — {bid.bidAmount}</h2>
              <p className="text-sm text-gray-600">Status: {bid.status}</p>
              {bid.tender && (
                <div className="mt-2">
                  <h3 className="font-medium">Tender</h3>
                  {/* if tender is awarded, show simple notice instead of tender card */}
                  {bid.tender.status !== 'awarded' ? (
                    <TenderCard tender={bid.tender} statusBadge={bid.status} DateDisplay={DateDisplay} />
                  ) : (
                    <div className="p-3 bg-green-50 text-green-700 rounded">This tender was awarded to {bid.tender.winnerName}.</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <aside>
        <NotificationList recipient={session?.user?.name || 'User'} />
      </aside>
      </div>
    </main>
  );
}
