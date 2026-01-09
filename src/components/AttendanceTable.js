'use client';

export default function AttendanceTable({ records, loading, selectedDate, isDarkMode }) {
  return (
    <div
      className={`rounded-xl overflow-hidden border shadow-lg transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className={`text-xs uppercase tracking-wider border-b ${
                isDarkMode
                  ? 'bg-slate-950 text-slate-400 border-slate-800'
                  : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}
            >
              <th className="py-4 px-6 font-semibold">Time Log</th>
              <th className="py-4 px-6 font-semibold">Student Name</th>
              <th className="py-4 px-6 font-semibold">Roll ID</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold">Device</th>
            </tr>
          </thead>
          <tbody
            className={`text-sm divide-y ${
              isDarkMode ? 'divide-slate-800' : 'divide-gray-100'
            }`}
          >
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-12 animate-pulse text-gray-500">
                  Syncing...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-gray-500">
                  No records for {selectedDate}.
                </td>
              </tr>
            ) : (
              records.map((rec, index) => {
                const isProxy = rec.status.includes("WARN");
                const isDenied = rec.status.includes("Denied");

                let statusStyle = isDarkMode
                  ? "bg-emerald-900/30 text-emerald-400 border-emerald-900"
                  : "bg-emerald-100 text-emerald-700 border-emerald-200";
                if (isProxy)
                  statusStyle = isDarkMode
                    ? "bg-amber-900/30 text-amber-400 border-amber-900"
                    : "bg-amber-100 text-amber-700 border-amber-200";
                if (isDenied)
                  statusStyle = isDarkMode
                    ? "bg-red-900/30 text-red-400 border-red-900"
                    : "bg-red-100 text-red-700 border-red-200";

                return (
                  <tr
                    key={index}
                    className={`transition duration-150 ${
                      isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`font-medium ${
                          isDarkMode ? 'text-slate-200' : 'text-gray-900'
                        }`}
                      >
                        {new Date(rec.timestamp).toLocaleTimeString()}
                      </span>
                    </td>
                    <td
                      className={`py-4 px-6 font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}
                    >
                      {rec.student_name}
                    </td>
                    <td
                      className={`py-4 px-6 font-mono ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-500'
                      }`}
                    >
                      {rec.roll}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`py-1 px-3 rounded-full text-xs border ${statusStyle}`}>
                        {rec.status}
                      </span>
                    </td>
                    <td
                      className={`py-4 px-6 text-xs font-mono ${
                        isDarkMode ? 'text-slate-600' : 'text-gray-400'
                      }`}
                    >
                      {rec.device_id}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
