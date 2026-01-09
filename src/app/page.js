'use client';
import { useState, useEffect, useRef } from 'react';
import LoginForm from '@/components/LoginForm';
import Header from '@/components/Header';
import StatsCards from '@/components/StatsCards';
import AttendanceTable from '@/components/AttendanceTable';
import Footer from '@/components/Footer';

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

  // Real-time polling reference
  const pollingIntervalRef = useRef(null);

  // --- Login Logic ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (inputPassword === 'admin') setIsAuthenticated(true);
    else setLoginError('Access Denied: Invalid Credentials');
  };

  // --- Data Fetching (without loading state) ---
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`/api/attendance?date=${selectedDate}`);
      const data = await res.json();
      if (data.success) setRecords(data.records);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // --- Real-time polling setup ---
  useEffect(() => {
    if (isAuthenticated) {
      // Initial data fetch
      fetchData(false);

      // Set up polling for real-time updates (every 5 seconds)
      pollingIntervalRef.current = setInterval(() => {
        fetchData(true); // silent fetch (no loading state)
      }, 5000);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
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
    return <LoginForm inputPassword={inputPassword} setInputPassword={setInputPassword} loginError={loginError} onSubmit={handleLogin} />;
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col min-h-screen">
        
        {/* Header & Controls */}
        <Header
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onDownload={downloadReport}
          onLogout={() => setIsAuthenticated(false)}
        />

        {/* Stats Cards */}
        <StatsCards records={records} isDarkMode={isDarkMode} />

        {/* Table */}
        <AttendanceTable
          records={records}
          loading={loading}
          selectedDate={selectedDate}
          isDarkMode={isDarkMode}
        />

        {/* Footer */}
        <Footer isDarkMode={isDarkMode} />

      </div>
    </div>
  );
}