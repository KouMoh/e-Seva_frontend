import TenderCard from '../../components/tenders/TenderCard';
import api from '../../lib/api';
import DateDisplay from '../../components/common/DateDisplay';

export default async function GrantedTendersPage() {
  let tenders = [];
  try {
    const res = await fetch(api('/api/tenders'), { cache: 'no-store' });
    if (res.ok) tenders = await res.json();
  } catch (err) {
    tenders = [];
  }
  const granted = tenders.filter(t => t.status === 'awarded');
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Granted Tenders</h1>
      {granted.length === 0 ? (
        <p>No granted tenders.</p>
      ) : (
        <ul className="grid gap-4">
          {granted.map(t => (
            <li key={t._id}>
              <TenderCard tender={t} statusBadge={t.status} DateDisplay={DateDisplay} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
