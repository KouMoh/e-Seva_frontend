"use client";
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { authenticatedApiCall } from '../../lib/api';

export default function TenderActions({ tenderId, onDeleted, tender }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!session?.accessToken) {
      alert('Authentication required');
      return;
    }

    if (!confirm('Delete this tender?')) return;
    setLoading(true);
    try {
      await authenticatedApiCall(`tenders/${tenderId}`, { method: 'DELETE' }, session.accessToken);
      alert('Deleted');
      onDeleted && onDeleted(tenderId);
    } catch (error) {
      console.error('Failed to delete tender:', error);
      alert(error.message || 'Failed to delete tender');
    } finally { 
      setLoading(false); 
    }
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
