"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { authenticatedApiCall } from '../../lib/api';

export default function NotificationList({ recipient }) {
  const { data: session } = useSession();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!recipient || !session?.accessToken) return;
    
    const fetchNotifications = async () => {
      try {
        const notificationsData = await authenticatedApiCall(`notifications?recipient=${encodeURIComponent(recipient)}`, { method: 'GET' }, session.accessToken);
        setNotes(notificationsData);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotes([]);
      }
    };

    fetchNotifications();
  }, [recipient, session?.accessToken]);

  if (!recipient) return null;

  return (
    <div className="p-4 border rounded">
      <h4 className="font-semibold mb-2">Notifications</h4>
      {notes.length === 0 && <div className="text-sm text-gray-600">No notifications</div>}
      <ul className="space-y-2">
        {notes.map(n => (
          <li key={n._id} className="text-sm">
            <a href={n.link || '#'} className="text-blue-600">{n.message}</a>
            <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}