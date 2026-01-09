'use client';

export default function Footer({ isDarkMode }) {
  return (
    <div className="mt-auto pt-8 text-center opacity-60">
      <p className={`text-xs ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`}>
        &copy; {new Date().getFullYear()} QuickTap IoT System. <br className="md:hidden" />
        Designed & Developed by <span className="font-semibold">Hasibur Rahman</span>.
      </p>
    </div>
  );
}
