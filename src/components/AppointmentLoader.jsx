export default function AppointmentSkeleton() {
  const rows = Array(5).fill(0);

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-100 animate-pulse">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th className="px-6 py-3 font-medium text-left">Property</th>
            <th className="px-6 py-3 font-medium text-left">Date</th>
            <th className="px-6 py-3 font-medium text-left">Time</th>
            <th className="px-6 py-3 font-medium text-left">Message</th>
            <th className="px-6 py-3 font-medium text-left">Status</th>
            <th className="px-6 py-3 font-medium text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((_, i) => (
            <tr key={i} className="border-t">
              {[...Array(6)].map((__, j) => (
                <td key={j} className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
