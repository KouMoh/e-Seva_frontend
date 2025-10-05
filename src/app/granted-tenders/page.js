"use client";
import { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { authenticatedApiCall } from '../../lib/api';
import TenderCard from '../../components/tenders/TenderCard';
import DateDisplay from '../../components/common/DateDisplay';

export default function GrantedTendersPage() {
  const { data: session } = useSession();
  const [tenders, setTenders] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tendersData, bidsData] = await Promise.all([
          authenticatedApiCall('tenders', { method: 'GET' }, session?.accessToken),
          authenticatedApiCall('bids/my-bids', { method: 'GET' }, session?.accessToken)
        ]);
        setTenders(tendersData);
        setMyBids(bidsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setTenders([]);
        setMyBids([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.accessToken]);

  // Filter to show only tenders won by this user
  const userWonTenders = useMemo(() => {
    if (!session?.user) return [];
    
    // If admin, show all granted tenders
    if (session.user.role === 'admin') {
      return tenders.filter(t => t.status === 'awarded');
    }
    
    // For regular users, show only tenders they won
    const wonBids = myBids.filter(bid => bid.status === 'granted');
    const wonTenderIds = wonBids.map(bid => bid.tender?._id).filter(Boolean);
    
    return tenders.filter(tender => 
      tender.status === 'awarded' && wonTenderIds.includes(tender._id)
    );
  }, [tenders, myBids, session?.user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading granted tenders...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        {session?.user?.role === 'admin' ? 'All Granted Tenders' : 'Your Won Tenders'}
      </h1>
      {userWonTenders.length === 0 ? (
        <p>
          {session?.user?.role === 'admin' 
            ? 'No granted tenders found.' 
            : 'You haven\'t won any tenders yet.'}
        </p>
      ) : (
        <ul className="grid gap-4">
          {userWonTenders.map(t => (
            <li key={t._id}>
              <TenderCard tender={t} statusBadge={t.status} DateDisplay={DateDisplay} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
