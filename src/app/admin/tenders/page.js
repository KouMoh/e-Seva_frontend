"use client";

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../lib/api';
import TenderActions from '../../../components/admin/TenderActions';

export default function AdminTendersPage() {
  const [tenders, setTenders] = useState([]);

  // Refetch tenders
  const fetchTenders = useCallback(() => {
    fetch(api('/api/tenders')).then(r => r.json()).then(setTenders).catch(() => setTenders([]));
  }, []);

  useEffect(() => {
    fetchTenders();
    // Refetch when page regains focus
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchTenders();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchTenders]);

  const openTenders = tenders.filter(t => t.status !== 'awarded');
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Manage Tenders</h1>
      <div className="space-y-4">
        {openTenders.map((t) => (
          <div key={t._id} className="p-4 border rounded flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{t.title}</h2>
              <p className="text-sm text-gray-600">ID: {t.tenderId}  {t.location}</p>
            </div>
            <div className="flex gap-2">
              <TenderActions tender={t} tenderId={t._id} onDeleted={(id) => setTenders(prev => prev.filter(x => x._id !== id))} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
