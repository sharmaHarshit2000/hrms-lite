import React from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100 font-sans text-slate-900 overflow-x-hidden">
      <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 transition-all duration-300 shadow-[0_1px_15px_-3px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4 group cursor-default">
            <div className="w-12 h-12 bg-linear-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
              HR
            </div>
            <div>
              <div className="font-black text-slate-900 leading-none text-xl tracking-tight">HRMS <span className="text-indigo-600">Lite</span></div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mt-1.5 flex items-center">
                <span className="w-1 h-1 bg-indigo-400 rounded-full mr-2"></span>
                Personnel Ecosystem
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-1 bg-slate-100/50 p-1.5 rounded-xl border border-slate-200/50">
            <button className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">Dashboard</button>
            <button className="px-4 py-2 bg-white text-xs font-bold text-indigo-600 rounded-lg shadow-sm border border-slate-200/50 uppercase tracking-widest">Workspace</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative">
        {/* Subtle background flourishes */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-64 h-64 bg-violet-50/50 rounded-full blur-3xl"></div>

        {children}
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 text-center">
        <div className="inline-flex items-center space-x-2 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <span className="h-px w-8 bg-slate-200"></span>
          <span>HRMS Lite Pro</span>
          <span className="h-px w-8 bg-slate-200"></span>
        </div>
        <div className="text-slate-400 text-xs font-medium">
          © {new Date().getFullYear()} Designed for high-performance teams.
        </div>
      </footer>
    </div>
  );
}