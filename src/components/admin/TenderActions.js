"use client";
import React, { useState } from 'react';
import api from '../../lib/api';

export default function TenderActions({ tenderId, onDeleted, tender }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this tender?')) return;
    setLoading(true);
    try {
      const res = await fetch(api(`/api/tenders/${tenderId}`), { method: 'DELETE' });
      if (res.ok) {
        alert('Deleted');
        onDeleted && onDeleted(tenderId);
      } else {
        const err = await res.json();
        alert(err?.message || 'Failed to delete');
      }
    } catch (e) {
      alert('Network error');
    } finally { setLoading(false); }
  };

  // if tender is awarded, disable edit/delete
  if (tender && tender.status === 'awarded') {
    return (
      <div className="px-3 py-2 bg-green-50 text-green-700 rounded">Awarded & Locked</div>
    );
  }

  return (
    <div className="flex gap-2">
      <a className="text-blue-600" href={`/admin/tenders/${tenderId}`}>Edit</a>
      <button className="text-red-600" onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
    </div>
  );
}
