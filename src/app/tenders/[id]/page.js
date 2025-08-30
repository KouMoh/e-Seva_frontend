import TenderCard from '../../../components/tenders/TenderCard';
import api from '../../../lib/api';
import BidModal from '../../../components/bids/BidModal';
import DateDisplay from '../../../components/common/DateDisplay';

export default async function TenderDetails({ params }) {
  const { id } = params;
  let tender = null;
  try {
  const res = await fetch(api(`/api/tenders/${id}`), { cache: 'no-store' });
    if (res.ok) tender = await res.json();
  } catch (err) {
    tender = null;
  }

  return (
    <div className="p-6">
      {!tender ? (
        <div className="p-4 bg-white rounded">Tender not found or backend unreachable.</div>
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
