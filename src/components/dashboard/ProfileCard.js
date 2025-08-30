export default function ProfileCard({ user }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{(user.name || 'U').charAt(0)}</div>
        <div>
          <div className="font-semibold">{user.name}</div>
          <div className="text-sm text-gray-600">{user.company}</div>
          <div className="text-sm text-gray-500">{user.location}</div>
        </div>
      </div>
    </div>
  );
}
