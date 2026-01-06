'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  // --- States ---
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication status
  const [inputPassword, setInputPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Login Logic ---
  const handleLogin = (e) => {
    e.preventDefault();
    // Demo Password: admin
    if (inputPassword === 'admin') {
      setIsAuthenticated(true);
    } else {
      setLoginError('Access Denied: Invalid Credentials');
    }
  };

  // --- Data Fetching Logic ---
  const fetchData = async () => {
    try {
      const res = await fetch('/api/attendance');
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh logic (Polling every 2 seconds)
  useEffect(() => {
    if (isAuthenticated) {
      fetchData(); // Initial fetch
      const interval = setInterval(fetchData, 2000); // Polling interval
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [isAuthenticated]);


  // --- VIEW 1: LOGIN SCREEN (Dark & Cyberpunk Style) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
          <div className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                QuickTap Secure
              </h1>
              <p className="text-slate-400 text-sm mt-2">IoT Attendance Gateway</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Passcode</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-slate-500 transition"
                  placeholder="Enter admin pin"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                />
              </div>
              
              {loginError && (
                <p className="text-red-400 text-sm text-center animate-pulse">{loginError}</p>
              )}

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-[1.02] active:scale-95"
              >
                Access Dashboard
              </button>
            </form>
          </div>
          <div className="bg-slate-900/50 p-4 text-center border-t border-slate-700">
            <p className="text-xs text-slate-500">System ID: ESP32-QT-V1</p>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: DASHBOARD (Modern Dark Mode) ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              QuickTap <span className="text-blue-500">Live</span>
            </h1>
            <p className="text-slate-400 mt-1">Real-time IoT Attendance Monitor</p>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Live Indicator with pulsing effect */}
            <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">System Online</span>
            </div>
            
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="bg-slate-800 hover:bg-red-900/30 text-slate-300 hover:text-red-400 px-4 py-2 rounded-lg text-sm transition border border-slate-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
           <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <h3 className="text-slate-500 text-xs uppercase font-bold">Total Records</h3>
              <p className="text-2xl font-bold text-white">{records.length}</p>
           </div>
           <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <h3 className="text-slate-500 text-xs uppercase font-bold">Last Active</h3>
              <p className="text-lg font-bold text-blue-400">
                {records.length > 0 ? new Date(records[0].timestamp).toLocaleTimeString() : '--:--'}
              </p>
           </div>
           <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <h3 className="text-slate-500 text-xs uppercase font-bold">System Status</h3>
              <p className="text-lg font-bold text-emerald-400">Operational</p>
           </div>
        </div>

        {/* Table Section */}
        <div className="bg-slate-900 shadow-2xl rounded-xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-800">
                  <th className="py-4 px-6 font-semibold">Time Log</th>
                  <th className="py-4 px-6 font-semibold">Student Name</th>
                  <th className="py-4 px-6 font-semibold">Roll ID</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Device</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-500 animate-pulse">Syncing with Cloud Database...</td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-600">
                      No attendance records found yet. <br/> Waiting for RFID taps...
                    </td>
                  </tr>
                ) : (
                  records.map((rec, index) => {
                    // Status Logic
                    const isProxy = rec.status.includes("WARN");
                    const isDenied = rec.status.includes("Denied");
                    
                    // Dynamic Styles based on status
                    let statusBadge = "bg-emerald-900/30 text-emerald-400 border border-emerald-900"; // Default Present
                    if (isProxy) statusBadge = "bg-amber-900/30 text-amber-400 border border-amber-900 font-bold animate-pulse";
                    if (isDenied) statusBadge = "bg-red-900/30 text-red-400 border border-red-900";

                    return (
                      <tr key={index} className="hover:bg-slate-800/50 transition duration-150">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-slate-200 font-medium">{new Date(rec.timestamp).toLocaleTimeString()}</span>
                            <span className="text-xs text-slate-500">{new Date(rec.timestamp).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium text-white">{rec.student_name}</td>
                        <td className="py-4 px-6 text-slate-400 font-mono">{rec.roll}</td>
                        <td className="py-4 px-6">
                          <span className={`py-1 px-3 rounded-full text-xs ${statusBadge}`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-600 text-xs font-mono">{rec.device_id}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}