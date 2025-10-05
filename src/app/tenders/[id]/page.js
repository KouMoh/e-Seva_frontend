"use client";
import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react';
import { authenticatedApiCall } from '../../../lib/api';
import TenderCard from '../../../components/tenders/TenderCard';
import BidModal from '../../../components/bids/BidModal';
import DateDisplay from '../../../components/common/DateDisplay';

export default function TenderDetails({ params }) {
  const { data: session } = useSession();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTender = async () => {
      try {
        const tenderData = await authenticatedApiCall(`tenders/${id}`, { method: 'GET' }, session?.accessToken);
        setTender(tenderData);
      } catch (error) {
        console.error('Failed to fetch tender:', error);
        setTender(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTender();
  }, [id, session?.accessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tender details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {!tender ? (
        <div className="p-4 bg-white rounded">Tender not found.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <main className="lg:col-span-2">
            <h1 className="text-2xl font-bold">{tender.title}</h1>
            <p className="text-sm text-gray-600">Tender ID: {tender.tenderId}</p>
              {tender.status === 'awarded' && (
                <div className="mt-2 text-green-700 font-semibold">Awarded to: {tender.winnerName}</div>
              )}
            <p className="mt-4">{tender.description}</p>

            <div className="mt-6">
              <h3 className="font-semibold">Critical Dates</h3>
                 <ul className="text-sm text-gray-600 mt-2">
                   <li>Publish Date: <DateDisplay value={tender.publishDate} /></li>
                   <li>Closing Date: <DateDisplay value={tender.submissionDeadline} /></li>
                 </ul>
            </div>

            <div className="mt-6">
                {tender.status !== 'awarded' && <BidModal tenderId={tender._id} />}
            </div>
          </main>

          <aside className="space-y-4">
            <div className="p-4 bg-white rounded shadow">
              <h4 className="font-semibold">Official Documents</h4>
              <ul className="mt-2 text-sm text-blue-600">
                <li><a href="#">Document 1 (PDF)</a></li>
                <li><a href="#">Document 2 (PDF)</a></li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded shadow">
              <h4 className="font-semibold">Updates & Corrigendum</h4>
              <p className="text-sm text-gray-600 mt-2">No updates.</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
