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
              {/* 1. Student Profile */}
              <th className="py-4 px-6 font-semibold min-w-[200px]">Student Profile</th>
              
              {/* 2. Time Log */}
              <th className="py-4 px-6 font-semibold whitespace-nowrap">Time Log</th>
              
              {/* 3. Status (Moved to Middle) */}
              <th className="py-4 px-6 font-semibold text-center">Status</th>

              {/* 4. RFID & Device */}
              <th className="py-4 px-6 font-semibold whitespace-nowrap">RFID & Device</th>
              
              {/* 5. Proxy Provider (Last) */}
              <th className="py-4 px-6 font-semibold min-w-[150px]">Proxy Provider</th>
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
                  Syncing data...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-gray-500">
                  No records found for <span className="font-bold">{selectedDate}</span>.
                </td>
              </tr>
            ) : (
              records.map((rec, index) => {
                // Logic Checks
                const isProxy = rec.status.includes("WARN") || rec.proximity_status === "WARN";
                const isDenied = rec.status.includes("Denied");

                // Row Background Logic
                const rowClass = isProxy || isDenied 
                  ? (isDarkMode ? 'bg-red-900/10 hover:bg-red-900/20' : 'bg-red-50 hover:bg-red-100')
                  : (isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50');

                // Badge Styles
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

                // Text Formatting Logic (Splitting into 2 lines)
                let mainText = "Present";
                let subText = "";

                if (isProxy) {
                  mainText = "Present";
                  subText = "(Proxy!)";
                } else if (isDenied) {
                  mainText = "Denied";
                  subText = "Unregistered";
                }

                return (
                  <tr key={index} className={`transition duration-150 ${rowClass}`}>
                    
                    {/* COLUMN 1: Student Profile */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {(isProxy || isDenied) ? (
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_8px_red] flex-shrink-0" title="Attention Required"></div>
                        ) : (
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/20 flex-shrink-0"></div>
                        )}

                        <div className="flex flex-col">
                          <span className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {rec.student_name}
                          </span>
                          <span className={`text-sm font-mono mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                            ID: {rec.roll}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* COLUMN 2: Time Log */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className={`font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          {new Date(rec.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(rec.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    {/* COLUMN 3: Status Badge (Centered & Split Text) */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <div className={`py-1 px-3 rounded-md border inline-flex flex-col items-center justify-center w-24 ${statusStyle}`}>
                        <span className="text-xs font-bold">{mainText}</span>
                        {subText && <span className="text-[9px] uppercase tracking-wider opacity-80">{subText}</span>}
                      </div>
                    </td>

                    {/* COLUMN 4: RFID & Device */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5">
                        <span className={`font-mono text-xs px-2 py-0.5 rounded w-fit ${
                          isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {rec.rfid_tag_id}
                        </span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                          {rec.device_id}
                        </span>
                      </div>
                    </td>

                    {/* COLUMN 5: Proxy Provider */}
                    <td className="py-4 px-6 text-left">
                      {isProxy && rec.proxy_provider ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-red-400 text-sm">
                            {rec.proxy_provider}
                          </span>
                          <span className="text-xs text-red-400/70 font-mono mt-0.5">
                            ID: {rec.proxy_provider_roll || "N/A"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-600/30 text-xl font-thin ml-2">—</span>
                      )}
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