import StatCard from '../../../components/dashboard/StatCard';
import api from '../../../lib/api';
import DateDisplay from '../../../components/common/DateDisplay';
import TenderCard from '../../../components/tenders/TenderCard';

export default async function AdminDashboard() {
  let tenders = [];
  try {
    const res = await fetch(api('/api/tenders'), { cache: 'no-store' });
    if (res.ok) tenders = await res.json();
  } catch (e) { tenders = []; }

  let bids = [];
  try {
    const bres = await fetch(api('/api/bids'), { cache: 'no-store' });
    if (bres.ok) bids = await bres.json();
  } catch (e) { bids = []; }

  const totalUsers = 42; // placeholder
  const totalTenders = tenders.length;
  const totalBids = bids.length;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Registered Users" value={totalUsers} />
        <StatCard title="Total Tenders Live" value={totalTenders} />
        <StatCard title="Total Bids Submitted" value={totalBids} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Recent Tenders</h2>
        <div className="grid gap-4">
          {tenders.filter(t => t.status !== 'awarded').slice(0,5).map(t => (
            <TenderCard key={t._id} tender={t} DateDisplay={DateDisplay} />
          ))}
        </div>
      </section>
    </main>
  );
}
