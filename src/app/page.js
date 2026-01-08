'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  // --- States ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Theme State (Default: Dark)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // --- Login Logic ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (inputPassword === 'admin') setIsAuthenticated(true);
    else setLoginError('Access Denied: Invalid Credentials');
  };

  // --- Data Fetching ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?date=${selectedDate}`);
      const data = await res.json();
      if (data.success) setRecords(data.records);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, selectedDate]);

  // --- Report Download ---
  const downloadReport = () => {
    if (records.length === 0) return alert("No data to download!");
    let csvContent = "data:text/csv;charset=utf-8,Time,Date,Student Name,Roll,Status,Device ID\n";
    records.forEach(rec => {
      const time = new Date(rec.timestamp).toLocaleTimeString();
      const date = new Date(rec.timestamp).toLocaleDateString();
      csvContent += `${time},${date},${rec.student_name},${rec.roll},${rec.status},${rec.device_id}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Attendance_Report_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- LOGIN VIEW ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4 relative">
        <div className="max-w-md w-full bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8 z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              QuickTap
            </h1>
            <p className="text-slate-500 text-sm mt-2 tracking-widest uppercase">Secure Admin Gateway</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white text-center tracking-widest placeholder-slate-600 transition"
              placeholder="••••••••"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
            />
            {loginError && <p className="text-red-400 text-xs text-center">{loginError}</p>}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-900/20">
              Unlock System
            </button>
          </form>
        </div>
        
        {/* Footer for Login Page */}
        <div className="absolute bottom-6 text-center opacity-40">
          <p className="text-xs text-slate-500">© 2026 QuickTap IoT. Developed by Hasibur Rahman.</p>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col min-h-screen">
        
        {/* Header & Controls */}
        <div className={`flex flex-col md:flex-row justify-between items-center mb-8 gap-4 p-6 rounded-2xl border shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <div>
            <h1 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              QuickTap <span className="text-blue-500">Admin</span>
            </h1>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Advanced Reporting System</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
             {/* Theme Toggle Button */}
             <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg border transition ${isDarkMode ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-gray-100 border-gray-300 text-gray-600'}`}
                title="Toggle Theme"
             >
                {isDarkMode ? '☀' : '🌙'}
             </button>

             {/* Date Picker */}
             <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Date:</span>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={`bg-transparent outline-none text-sm font-mono cursor-pointer ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                />
             </div>

             <button onClick={downloadReport} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition flex items-center gap-2">
                <span>⬇</span> Export
             </button>
            
            <button onClick={() => setIsAuthenticated(false)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:text-red-400' : 'bg-white border-gray-300 text-gray-600 hover:text-red-600'}`}>
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
           {[
             { title: "Total Records", value: records.length, color: isDarkMode ? "text-white" : "text-gray-900" },
             { title: "Last Active", value: records.length > 0 ? new Date(records[0].timestamp).toLocaleTimeString() : '--:--', color: "text-blue-500" },
             { title: "System Status", value: "Operational", color: "text-emerald-500", status: true }
           ].map((card, i) => (
             <div key={i} className={`p-5 rounded-xl border shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-xs uppercase font-bold tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{card.title}</h3>
                    <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                  </div>
                  {card.status && <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>}
                </div>
             </div>
           ))}
        </div>

        {/* Table */}
        <div className={`rounded-xl overflow-hidden border shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`text-xs uppercase tracking-wider border-b ${isDarkMode ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                  <th className="py-4 px-6 font-semibold">Time Log</th>
                  <th className="py-4 px-6 font-semibold">Student Name</th>
                  <th className="py-4 px-6 font-semibold">Roll ID</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Device</th>
                </tr>
              </thead>
              <tbody className={`text-sm divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-gray-100'}`}>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-12 animate-pulse text-gray-500">Syncing...</td></tr>
                ) : records.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-12 text-gray-500">No records for {selectedDate}.</td></tr>
                ) : (
                  records.map((rec, index) => {
                    const isProxy = rec.status.includes("WARN");
                    const isDenied = rec.status.includes("Denied");
                    
                    let statusStyle = isDarkMode ? "bg-emerald-900/30 text-emerald-400 border-emerald-900" : "bg-emerald-100 text-emerald-700 border-emerald-200";
                    if (isProxy) statusStyle = isDarkMode ? "bg-amber-900/30 text-amber-400 border-amber-900" : "bg-amber-100 text-amber-700 border-amber-200";
                    if (isDenied) statusStyle = isDarkMode ? "bg-red-900/30 text-red-400 border-red-900" : "bg-red-100 text-red-700 border-red-200";

                    return (
                      <tr key={index} className={`transition duration-150 ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}`}>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-900'}`}>{new Date(rec.timestamp).toLocaleTimeString()}</span>
                        </td>
                        <td className={`py-4 px-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{rec.student_name}</td>
                        <td className={`py-4 px-6 font-mono ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{rec.roll}</td>
                        <td className="py-4 px-6">
                          <span className={`py-1 px-3 rounded-full text-xs border ${statusStyle}`}>{rec.status}</span>
                        </td>
                        <td className={`py-4 px-6 text-xs font-mono ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`}>{rec.device_id}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 text-center opacity-60">
          <p className={`text-xs ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`}>
            &copy; {new Date().getFullYear()} QuickTap IoT System. <br className="md:hidden"/>
            Designed & Developed by <span className="font-semibold">Hasibur Rahman</span>.
          </p>
        </div>

      </div>
    </div>
  );
}