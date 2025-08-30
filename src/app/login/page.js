"use client";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="mt-4 text-gray-600">Choose your dashboard for now (auth will be added later):</p>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded transition-colors duration-150 hover:bg-blue-700 focus:outline-none cursor-pointer"
        >
          Company Dashboard
        </button>
        <button
          onClick={() => router.push('/admin/tenders')}
          className="px-4 py-2 border rounded transition-colors duration-150 hover:bg-gray-100 hover:border-blue-600 focus:outline-none cursor-pointer"
        >
          Admin Dashboard
        </button>
      </div>
    </main>
  );
}
