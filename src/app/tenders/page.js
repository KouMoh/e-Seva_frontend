import Link from 'next/link';
import api from '../../lib/api';
import TenderCard from '../../components/tenders/TenderCard';
import DateDisplay from '../../components/common/DateDisplay';

export const metadata = { title: 'Browse Tenders' };

export default async function TendersPage() {
  let tenders = [];
  try {
  const res = await fetch(api('/api/tenders'), { cache: 'no-store' });
    if (res.ok) tenders = await res.json();
    else tenders = [];
  } catch (err) {
    tenders = [];
  }

  const openTenders = tenders.filter(t => t.status !== 'awarded');
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Browse Tenders</h1>
      {openTenders.length === 0 ? (
        <p>No open tenders found or backend unreachable. Configure <code>NEXT_PUBLIC_API_BASE</code> for deployment.</p>
      ) : (
        <ul className="grid gap-4">
          {openTenders.map((t) => (
            <li key={t._id}>
              <TenderCard tender={t} statusBadge={t.status} DateDisplay={DateDisplay} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
