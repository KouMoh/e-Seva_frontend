export default function StatCard({ title, value }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}
