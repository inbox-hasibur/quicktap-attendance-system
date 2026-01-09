'use client';

export default function LoginForm({ inputPassword, setInputPassword, loginError, onSubmit }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4 relative">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8 z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            QuickTap
          </h1>
          <p className="text-slate-500 text-sm mt-2 tracking-widest uppercase">Secure Admin Gateway</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <input
            type="password"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white text-center tracking-widest placeholder-slate-600 transition"
            placeholder="••••••••"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
          />
          {loginError && <p className="text-red-400 text-xs text-center">{loginError}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-900/20"
          >
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
