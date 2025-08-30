export default function RecentActivity({ activities = [] }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h4 className="font-semibold mb-3">Recent Activity</h4>
      <ul className="text-sm text-gray-700 space-y-2">
        {activities.length === 0 ? (
          <li className="text-gray-500">No recent activity</li>
        ) : (
          activities.map((a, i) => (
            <li key={i} className="flex justify-between">
              <span>{a.text}</span>
              <span className="text-gray-400">{a.time}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
