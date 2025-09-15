'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function BidModal({ tenderId }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [bidAmount, setBidAmount] = useState('');
  const [bidderName, setBidderName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Pre-fill bidder name from current user if available
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.name) setBidderName(u.name);
      }
    } catch (_) {}
    if (!bidderName) setBidderName('Test IT User');
  }, []);

  const openModal = () => { setOpen(true); setStep(1); setMessage(null); };
  const closeModal = () => setOpen(false);

  const next = () => setStep(s => Math.min(2, s + 1));
  const back = () => setStep(s => Math.max(1, s - 1));

  const submit = async () => {
    setSubmitting(true);
    setMessage(null);
    try {
  const res = await fetch(api(`/api/bids/${tenderId}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidderName, bidAmount: Number(bidAmount), documents: [] }),
      });
      if (res.ok) {
        setMessage('Bid submitted successfully');
      } else {
        const err = await res.json();
        setMessage(err?.message || 'Failed to submit bid');
      }
    } catch (e) {
      setMessage('Network error submitting bid');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <button onClick={openModal} className="bg-green-600 text-white px-4 py-2 rounded">Apply Now</button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Apply for tender</h3>
              <button onClick={closeModal} className="text-gray-600">Close</button>
            </div>

            {message && <div className="mb-4 text-sm text-green-600">{message}</div>}

            {step === 1 && (
              <div>
                <label className="block text-sm font-medium">Your Name</label>
                <input className="border p-2 w-full mt-1" value={bidderName} onChange={e => setBidderName(e.target.value)} />

                <label className="block text-sm font-medium mt-3">Bid Amount (INR)</label>
                <input type="number" className="border p-2 w-full mt-1" value={bidAmount} onChange={e => setBidAmount(e.target.value)} />

                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <label className="block text-sm font-medium">Document Upload (placeholder)</label>
                <div className="mt-2 text-sm text-gray-600">This is a placeholder for document uploads.</div>

                <div className="mt-4 flex justify-between">
                  <button onClick={back} className="px-4 py-2 border rounded">Back</button>
                  <button onClick={submit} disabled={submitting} className="bg-green-600 text-white px-4 py-2 rounded">{submitting ? 'Submitting...' : 'Submit Bid'}</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
