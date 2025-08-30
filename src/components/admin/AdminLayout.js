import React from 'react';
import Sidebar from '../layout/Sidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar role="admin" />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
