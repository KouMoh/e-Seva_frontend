import StatCard from '../../components/dashboard/StatCard';
import TenderCard from '../../components/tenders/TenderCard';
import ProfileCard from '../../components/dashboard/ProfileCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import api from '../../lib/api';
import DateDisplay from '../../components/common/DateDisplay';

export default async function DashboardPage() {
  let tenders = [];
  try {
  const res = await fetch(api('/api/tenders'), { cache: 'no-store' });
    if (res.ok) tenders = await res.json();
  } catch (err) {
    tenders = [];
  }

  // Fetch or seed the test IT company user from backend
  let user = { name: 'Test IT User', company: 'TechNova IT Pvt. Ltd.', location: 'Bengaluru' };
  try {
    const ures = await fetch(api('/api/users/test-company'), { cache: 'no-store' });
    if (ures.ok) user = await ures.json();
  } catch (e) {}

  // fetch this user's bids (by name) and compute stats
  let myBids = [];
  try {
    const bres = await fetch(api(`/api/bids/my-bids?bidder=${encodeURIComponent(user.name)}`), { cache: 'no-store' });
    if (bres.ok) myBids = await bres.json();
  } catch (e) { myBids = []; }

  // Compute recommended tender count based on company description keyword matching
  const normalize = (s) => (s || '').toLowerCase();
  const extractKeywords = (text) => {
    const base = normalize(text);
    const words = base.split(/[^a-z0-9]+/).filter(Boolean);
    const stop = new Set(['the','and','for','with','of','to','in','on','a','an','we','our','services','service','solution','solutions','pvt','ltd','private','limited','company','client','clients','across']);
    const stems = words
      .filter(w => (w.length > 2 || w === 'it') && !stop.has(w))
      .map(w => w.replace(/(ing|ed|es|s)$/,'').slice(0,24));
    return Array.from(new Set(stems));
  };
  const tokenizeTender = (t) => {
    const base = normalize(`${t?.title || ''} ${t?.description || ''} ${t?.category || ''}`);
    const words = base.split(/[^a-z0-9]+/).filter(Boolean);
    const stems = words.map(w => w.replace(/(ing|ed|es|s)$/,'').slice(0,24));
    return new Set(stems);
  };
  const companyKeywords = extractKeywords(user.description || `${user.company} ${user.name}`);
  const priority = new Set(['it','infrastructur','software','cloud','web','maintenanc','develop']);
  const domainKeywords = new Set(['it','infrastructur','software','cloud','web','maintenanc','develop','system','network','security','devops','database','applic','portal','site','digit','data','support']);
  const isRecommended = (t) => {
    if (!t || t.status === 'awarded') return false;
    const tenderTokens = tokenizeTender(t);
    let overlap = 0;
    for (const k of companyKeywords) {
      if (tenderTokens.has(k)) overlap++;
    }
    const hasPriority = Array.from(priority).some(p => tenderTokens.has(p) && (companyKeywords.includes ? companyKeywords.includes(p) : companyKeywords.indexOf(p) !== -1));
    const matchesDomain = Array.from(domainKeywords).some(p => tenderTokens.has(p));
    // Require at least one IT domain token AND (overlap>=1 or shared priority)
    return matchesDomain && (overlap >= 1 || hasPriority);
  };
  const recommendedList = tenders.filter(isRecommended);
  const recommended = recommendedList.length;
  // active bids: submitted or under-review (not rejected or granted)
  const activeBids = myBids.filter(b => !['rejected','granted'].includes(b.status)).length;
  const upcomingDeadlines = tenders.filter(t => new Date(t.submissionDeadline) > new Date()).length;
  const tendersWon = myBids.filter(b => b.status === 'granted').length || tenders.filter(t => t.status === 'awarded' && t.winnerName === user.name).length;

  const activities = [
    { text: 'Submitted bid for IT Maintenance', time: '2 days ago' },
    { text: 'Viewed tender: Supply of Stationery', time: '5 days ago' },
  ];

  return (
    <>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
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
        {recommendedList.length === 0 ? (
              <div className="p-4 bg-white rounded">No tenders available.</div>
            ) : (
          recommendedList.map(t => <TenderCard key={t._id} tender={t} DateDisplay={DateDisplay} />)
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <ProfileCard user={user} />
          <RecentActivity activities={activities} />
        </aside>
      </section>
    </>
  );
}
