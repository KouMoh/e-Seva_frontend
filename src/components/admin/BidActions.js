"use client";
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { authenticatedApiCall } from '../../lib/api';

export default function BidActions({ bid }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status) => {
    if (!session?.accessToken) {
      alert('Authentication required');
      return;
    }

    if (!confirm(`Set status to ${status}?`)) return;
    setLoading(true);
    try {
      await authenticatedApiCall(`bids/${bid._id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      }, session.accessToken);
      alert('Status updated');
      location.reload();
    } catch (error) {
      console.error('Failed to update bid status:', error);
      alert(error.message || 'Failed to update status');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="flex gap-2">
      { !['granted','rejected'].includes(bid.status) ? (
        <>
          <button disabled={loading} onClick={() => updateStatus('granted')} className="px-2 py-1 bg-green-600 text-white rounded">Grant</button>
          <button disabled={loading} onClick={() => updateStatus('rejected')} className="px-2 py-1 bg-red-600 text-white rounded">Reject</button>
        </>
      ) : (
        <span className="text-sm text-gray-600">Decision: {bid.status}</span>
      )}
    </div>
  );
}
