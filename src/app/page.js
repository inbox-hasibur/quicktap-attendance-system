'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // ডাটা ফেচ করার ফাংশন
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

  // অটো-রিফ্রেশ (প্রতি ২ সেকেন্ড পর পর ডাটা আনবে)
  useEffect(() => {
    fetchData(); // প্রথমবার লোড
    const interval = setInterval(fetchData, 2000); // প্রতি ২ সেকেন্ডে পোলিং
    return () => clearInterval(interval); // ক্লিনআপ
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">QuickTap Dashboard 🚀</h1>
            <p className="text-gray-500 mt-1">Real-time IoT Attendance Monitor</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow text-sm">
            <span className="text-green-500 font-bold">● Live</span> Status
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-4 px-6 font-semibold">Time</th>
                <th className="py-4 px-6 font-semibold">Student Name</th>
                <th className="py-4 px-6 font-semibold">Roll</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Device ID</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8">Loading data...</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">No attendance records found yet.</td>
                </tr>
              ) : (
                records.map((rec, index) => {
                  // স্ট্যাটাস অনুযায়ী কালার লজিক
                  const isProxy = rec.status.includes("WARN");
                  const isDenied = rec.status.includes("Denied");
                  
                  let statusColor = "bg-green-100 text-green-700"; // Default Present
                  if (isProxy) statusColor = "bg-orange-100 text-orange-700 font-bold";
                  if (isDenied) statusColor = "bg-red-100 text-red-700";

                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition duration-150">
                      <td className="py-3 px-6 whitespace-nowrap">
                        {new Date(rec.timestamp).toLocaleTimeString()} 
                        <span className="text-xs text-gray-400 ml-1">
                          {new Date(rec.timestamp).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-6 font-medium">{rec.student_name}</td>
                      <td className="py-3 px-6">{rec.roll}</td>
                      <td className="py-3 px-6">
                        <span className={`py-1 px-3 rounded-full text-xs ${statusColor}`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-gray-400 text-xs">{rec.device_id}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}