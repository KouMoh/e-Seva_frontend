"use client";
import React, { useState } from 'react';
import api from '../../lib/api';

export default function CreateTenderForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [tenderId, setTenderId] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      const payload = { title, tenderId, location };
      const res = await fetch(api('/api/tenders'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        const t = await res.json();
        alert('Created');
        onCreated && onCreated(t);
      } else {
        const err = await res.json();
        alert(err?.message || 'Failed');
      }
    } catch (e) {
      alert('Network error');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input className="mt-1 w-full border p-2 rounded" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Tender ID</label>
        <input className="mt-1 w-full border p-2 rounded" value={tenderId} onChange={e => setTenderId(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Location</label>
        <input className="mt-1 w-full border p-2 rounded" value={location} onChange={e => setLocation(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={submit} disabled={submitting}>{submitting ? 'Creating...' : 'Create'}</button>
      </div>
    </div>
  );
}
