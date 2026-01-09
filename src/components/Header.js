'use client';

export default function Header({
  isDarkMode,
  setIsDarkMode,
  selectedDate,
  setSelectedDate,
  onDownload,
  onLogout,
}) {
  return (
    <div
      className={`flex flex-col md:flex-row justify-between items-center mb-8 gap-4 p-6 rounded-2xl border shadow-sm transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
      }`}
    >
      <div>
        <h1
          className={`text-3xl font-bold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          QuickTap <span className="text-blue-500">Admin</span>
        </h1>
        <p
          className={`text-sm mt-1 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-500'
          }`}
        >
          Advanced Reporting System
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-lg border transition ${
            isDarkMode
              ? 'bg-slate-800 border-slate-700 text-yellow-400'
              : 'bg-gray-100 border-gray-300 text-gray-600'
          }`}
          title="Toggle Theme"
        >
          {isDarkMode ? '☀' : '🌙'}
        </button>

        {/* Date Picker */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'
          }`}
        >
          <span
            className={`text-xs ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`}
          >
            Date:
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`bg-transparent outline-none text-sm font-mono cursor-pointer ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          />
        </div>

        <button
          onClick={onDownload}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition flex items-center gap-2"
        >
          <span>⬇</span> Export
        </button>

        <button
          onClick={onLogout}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
            isDarkMode
              ? 'bg-slate-800 border-slate-700 hover:text-red-400'
              : 'bg-white border-gray-300 text-gray-600 hover:text-red-600'
          }`}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
