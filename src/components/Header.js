import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold">E-Suvidha</div>
          <nav className="hidden sm:flex gap-4 text-sm text-gray-600">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/tenders">Tenders</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm px-3 py-1 rounded hover:bg-gray-100">Login</Link>
          <Link href="/register" className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Register</Link>
        </div>
      </div>
    </header>
  );
}
