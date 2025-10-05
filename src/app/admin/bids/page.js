"use client";
import React from 'react';
import { useSession } from 'next-auth/react';
import { authenticatedApiCall } from '../../../lib/api';
import { useEffect, useState } from 'react';
import BidActions from '../../../components/admin/BidActions';

export default function AdminBidsPage() {
  const { data: session } = useSession();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchBids = async () => {
      try {
        const bidsData = await authenticatedApiCall('bids', { method: 'GET' }, session.accessToken);
        // Sort bids newest-first by updatedAt, falling back to createdAt if needed
        const sorted = Array.isArray(bidsData)
          ? bidsData.slice().sort((a, b) => {
              const aDate = new Date(a.updatedAt || a.createdAt || 0).getTime();
              const bDate = new Date(b.updatedAt || b.createdAt || 0).getTime();
              return bDate - aDate;
            })
          : bidsData;
        setBids(sorted);
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
          <p className="mt-4 text-gray-600">Loading bids...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">View Bids</h1>
      {bids.length === 0 && <p className="text-gray-600">No bids yet.</p>}
      <div className="space-y-4">
        {bids.map((b) => (
              <div key={b._id} className="p-4 border rounded">
                <h2 className="font-semibold">{b.bidderName} — ₹{b.bidAmount}</h2>
                <p className="text-sm text-gray-600">Status: {b.status}</p>
                {b.tender && (
                  <div className="mt-2">
                    <h3 className="font-medium">Tender</h3>
                    <div className="p-2 border rounded">
                      <div className="font-semibold">{b.tender.title}</div>
                      <div className="text-sm text-gray-600">{b.tender.category} • {b.tender.location}</div>
                      <div className="mt-2"><BidActions bid={b} /></div>
                      {b.tender.status === 'awarded' && b.tender.winnerBid === b._id && (
                        <div className="mt-2 text-green-700 font-medium">Winner</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
        ))}
      </div>
    </>
  );
}