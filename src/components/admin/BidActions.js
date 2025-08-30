"use client";
import React, { useState } from 'react';
import api from '../../lib/api';

export default function BidActions({ bid }) {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status) => {
    if (!confirm(`Set status to ${status}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(api(`/api/bids/${bid._id}/status`), { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      if (res.ok) {
        alert('Status updated');
        location.reload();
      } else {
        const err = await res.json();
        alert(err?.message || 'Failed');
      }
    } catch (e) {
      alert('Network error');
    } finally { setLoading(false); }
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
