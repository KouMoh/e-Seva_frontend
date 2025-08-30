import StatCard from '../../components/dashboard/StatCard';
import TenderCard from '../../components/tenders/TenderCard';
import ProfileCard from '../../components/dashboard/ProfileCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import api from '../../lib/api';
import DateDisplay from '../../components/common/DateDisplay';

const TEST_USER = { name: 'Test User', company: 'Acme Solutions', location: 'Delhi' };

export default async function DashboardPage() {
  let tenders = [];
  try {
  const res = await fetch(api('/api/tenders'), { cache: 'no-store' });
    if (res.ok) tenders = await res.json();
  } catch (err) {
    tenders = [];
  }

  // fetch this user's bids (mocked by name) and compute stats
  let myBids = [];
  try {
    const bres = await fetch(api(`/api/bids/my-bids?bidder=${encodeURIComponent(TEST_USER.name)}`), { cache: 'no-store' });
    if (bres.ok) myBids = await bres.json();
  } catch (e) { myBids = []; }

  // exclude already awarded tenders from recommended list
  const recommended = tenders.filter(t => t.status !== 'awarded').length;
  // active bids: submitted or under-review (not rejected or granted)
  const activeBids = myBids.filter(b => !['rejected','granted'].includes(b.status)).length;
  const upcomingDeadlines = tenders.filter(t => new Date(t.submissionDeadline) > new Date()).length;
  const tendersWon = myBids.filter(b => b.status === 'granted').length || tenders.filter(t => t.status === 'awarded' && t.winnerName === TEST_USER.name).length;

  const activities = [
    { text: 'Submitted bid for IT Maintenance', time: '2 days ago' },
    { text: 'Viewed tender: Supply of Stationery', time: '5 days ago' },
  ];

  return (
    <>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {TEST_USER.name}!</h1>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Recommended Tenders" value={recommended} />
        <StatCard title="Active Bids" value={activeBids} />
        <StatCard title="Upcoming Deadlines" value={upcomingDeadlines} />
        <StatCard title="Tenders Won" value={tendersWon} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recommended Tenders for You</h2>
          <div className="grid gap-4">
        {tenders.filter(t => t.status !== 'awarded').length === 0 ? (
              <div className="p-4 bg-white rounded">No tenders available.</div>
            ) : (
          tenders.filter(t => t.status !== 'awarded').map(t => <TenderCard key={t._id} tender={t} DateDisplay={DateDisplay} />)
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <ProfileCard user={TEST_USER} />
          <RecentActivity activities={activities} />
        </aside>
      </section>
    </>
  );
}
