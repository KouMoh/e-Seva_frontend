const Feature = ({ title, desc }) => (
  <div className="p-6 bg-white rounded shadow-sm">
    <h4 className="font-semibold">{title}</h4>
    <p className="text-sm mt-2 text-gray-600">{desc}</p>
  </div>
);

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature title="Intelligent Matching" desc="Get tender suggestions tailored to your business profile." />
          <Feature title="Real-time Updates" desc="Receive alerts and corrigendum notifications instantly." />
          <Feature title="Simplified Bidding" desc="Fill one guided form to apply to multiple tenders efficiently." />
        </div>
      </div>
    </section>
  );
}
