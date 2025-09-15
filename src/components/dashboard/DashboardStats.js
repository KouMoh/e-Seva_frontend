"use client";
import { useEffect, useMemo, useState } from 'react';
import StatCard from './StatCard';
import api from '../../lib/api';

export default function DashboardStats({ user, initialTenders = [], initialMyBids = [] }) {
  const [tenders, setTenders] = useState(initialTenders);
  const [myBids, setMyBids] = useState(initialMyBids);

  // Periodically refresh to keep stats timely
  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      try {
        const [tRes, bRes] = await Promise.all([
          fetch(api('/api/tenders'), { cache: 'no-store' }),
          fetch(api(`/api/bids/my-bids?bidder=${encodeURIComponent(user.name)}`), { cache: 'no-store' })
        ]);
        if (!alive) return;
        if (tRes.ok) setTenders(await tRes.json());
        if (bRes.ok) setMyBids(await bRes.json());
      } catch (_) {}
    };
    refresh();
    const id = setInterval(refresh, 5000);
    const onVis = () => { if (!document.hidden) refresh(); };
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVis);
    return () => { alive = false; clearInterval(id); };
  }, [user?.name]);

  const { recommended, upcomingDeadlines, activeBids, tendersWon } = useMemo(() => {
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
    const companyKeywords = extractKeywords(user?.description || `${user?.company || ''} ${user?.name || ''}`);
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
      return matchesDomain && (overlap >= 1 || hasPriority);
    };
    const recommendedList = (tenders || []).filter(isRecommended);
    const active = (myBids || []).filter(b => !['rejected','granted'].includes((b.status || '').toLowerCase())).length;
    const deadlines = (tenders || []).filter(t => new Date(t.submissionDeadline) > new Date()).length;
    // Count total number of granted/awarded tenders from the backend data source
    const won = (tenders || []).filter(t => (t.status || '').toLowerCase() === 'awarded').length;
    return { recommended: recommendedList.length, activeBids: active, upcomingDeadlines: deadlines, tendersWon: won };
  }, [tenders, myBids, user]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
      <StatCard title="Recommended Tenders" value={recommended} />
      <StatCard title="Active Bids" value={activeBids} />
      <StatCard title="Upcoming Deadlines" value={upcomingDeadlines} />
      <StatCard title="Tenders Won" value={tendersWon} />
    </div>
  );
}


