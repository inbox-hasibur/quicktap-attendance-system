'use client';

export default function StatsCards({ records, isDarkMode }) {
  const stats = [
    {
      title: "Total Records",
      value: records.length,
      color: isDarkMode ? "text-white" : "text-gray-900",
    },
    {
      title: "Last Active",
      value:
        records.length > 0
          ? new Date(records[0].timestamp).toLocaleTimeString()
          : '--:--',
      color: "text-blue-500",
    },
    {
      title: "System Status",
      value: "Operational",
      color: "text-emerald-500",
      status: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((card, i) => (
        <div
          key={i}
          className={`p-5 rounded-xl border shadow-sm transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3
                className={`text-xs uppercase font-bold tracking-wider ${
                  isDarkMode ? 'text-slate-500' : 'text-gray-400'
                }`}
              >
                {card.title}
              </h3>
              <p className={`text-2xl font-bold mt-1 ${card.color}`}>
                {card.value}
              </p>
            </div>
            {card.status && (
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
