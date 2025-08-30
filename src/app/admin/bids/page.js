"use client";
import React from 'react';
import api from '../../../lib/api';
import { useEffect, useState } from 'react';
import BidActions from '../../../components/admin/BidActions';

export default function AdminBidsPage() {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    fetch(api('/api/bids')).then(r => r.json()).then(setBids).catch(() => setBids([]));
  }, []);

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
