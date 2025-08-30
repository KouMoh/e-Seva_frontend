"use client";

import Link from 'next/link';
import BidModal from '../../components/bids/BidModal';
import { useEffect, useState } from 'react';

export default function TenderCard({ tender, statusBadge, DateDisplay }) {
  // fallback for DateDisplay if not provided
  const DateFmt = DateDisplay || (({ value }) => <>{value ? String(value) : '—'}</>);
  const [formattedValue, setFormattedValue] = useState(
    typeof tender.value === 'number' ? tender.value.toString() : tender.value || ''
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof tender.value === 'number') {
      setFormattedValue(tender.value.toLocaleString());
    }
  }, [tender.value]);

  return (
    <article className="p-4 bg-white rounded shadow">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold">{tender.title}</h3>
        {typeof statusBadge !== 'undefined' && (
          <span className={`text-xs font-medium px-2 py-1 rounded ${statusBadge === 'granted' ? 'bg-green-100 text-green-800' : statusBadge === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {statusBadge}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600">{tender.issuingAuthority ?? tender.location} • {tender.category}</p>
      <p className="mt-2">Value: ₹{formattedValue}</p>
      <p className="text-sm text-gray-500">Deadline: <DateFmt value={tender.submissionDeadline} /></p>
      <div className="mt-3 flex items-center gap-4">
        <Link href={`/tenders/${tender._id}`} className="text-blue-600 underline">View details</Link>
        {/* don't allow bidding UI on tenders that have been awarded */}
        {tender.status !== 'awarded' && <BidModal tenderId={tender._id} />}
        {tender.status === 'awarded' && (
          <span className="text-sm text-green-700 font-medium">Awarded</span>
        )}
      </div>
    </article>
  );
}
