import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold leading-tight">Simplifying Public Tenders for India&#39;s MSMEs</h1>
          <p className="mt-4 text-lg opacity-90">Find matching tenders, apply faster and win more contracts with guided forms and smart alerts.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/register" className="bg-white text-blue-600 px-4 py-2 rounded font-semibold">Get Started</Link>
            <Link href="/tenders" className="border border-white/30 px-4 py-2 rounded">Browse Tenders</Link>
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-white/10 p-6 rounded-lg">
            <p className="text-sm">Featured: Instant matching for your business profile</p>
            <div className="mt-4 p-4 bg-white/20 rounded">
              <h3 className="font-semibold">Recommendation</h3>
              <p className="text-sm mt-2">We surface tenders that match your industry and location.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
