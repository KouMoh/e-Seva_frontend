"use client";
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { authenticatedApiCall } from '../../lib/api';

export default function CreateTenderForm({ onCreated }) {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [tenderId, setTenderId] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [value, setValue] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [submissionDeadline, setSubmissionDeadline] = useState('');
  const [status, setStatus] = useState('open');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!session?.accessToken) {
      alert('Authentication required');
      return;
    }

    setSubmitting(true);
    try {
      if (!title?.trim() || !tenderId?.trim()) {
        alert('Title and Tender ID are required');
        return;
      }

      const payload = {
        title: title.trim(),
        tenderId: tenderId.trim(),
        location: location.trim() || undefined,
        description: description.trim() || undefined,
        category: category.trim() || undefined,
        value: value !== '' ? Number(value) : undefined,
        publishDate: publishDate || undefined,
        submissionDeadline: submissionDeadline || undefined,
        status: status || undefined,
      };
      
      const tender = await authenticatedApiCall('tenders', {
        method: 'POST',
        body: JSON.stringify(payload)
      }, session.accessToken);
      
      alert('Created');
      onCreated && onCreated(tender);
    } catch (error) {
      console.error('Failed to create tender:', error);
      alert(error.message || 'Failed to create tender');
    } finally { 
      setSubmitting(false); 
    }
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
        <label className="block text-sm font-medium">Description</label>
        <textarea className="mt-1 w-full border p-2 rounded" rows={4} value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Category</label>
        <input className="mt-1 w-full border p-2 rounded" value={category} onChange={e => setCategory(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Estimated Value</label>
        <input type="number" className="mt-1 w-full border p-2 rounded" value={value} onChange={e => setValue(e.target.value)} min="0" step="0.01" />
      </div>
      <div>
        <label className="block text-sm font-medium">Location</label>
        <input className="mt-1 w-full border p-2 rounded" value={location} onChange={e => setLocation(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Publish Date</label>
          <input type="date" className="mt-1 w-full border p-2 rounded" value={publishDate} onChange={e => setPublishDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Submission Deadline</label>
          <input type="date" className="mt-1 w-full border p-2 rounded" value={submissionDeadline} onChange={e => setSubmissionDeadline(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Status</label>
        <select className="mt-1 w-full border p-2 rounded" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="awarded">Awarded</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={submit} disabled={submitting}>{submitting ? 'Creating...' : 'Create'}</button>
      </div>
    </div>
  );
}
