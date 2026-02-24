import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";

export default function AttendancePanel({ employee }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("Present");

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const presentCount = useMemo(
    () => records.filter((r) => r.status === "Present").length,
    [records]
  );

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await api.listAttendance(employee.id);
      setRecords(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee.id]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.markAttendance(employee.id, { date, status });
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-xl font-bold text-slate-400">
            {employee.full_name.charAt(0)}
          </div>
          <div>
            <div className="text-xl font-black text-slate-800 tracking-tight">{employee.full_name}</div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-widest leading-none">
                {employee.employee_id}
              </span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                {employee.department}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-3xl font-black text-indigo-600 leading-none">{presentCount}</div>
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1.5">Present Days</div>
        </div>
      </div>

      <form className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-6" onSubmit={submit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reporting Date</label>
            <input
              type="date"
              className="w-full h-12 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 shadow-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Daily Status</label>
            <div className="relative">
              <select
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 appearance-none cursor-pointer shadow-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Present</option>
                <option>Absent</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <button
          className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-lg shadow-slate-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          disabled={busy}
        >
          {busy ? "Processing..." : "Mark Presence"}
        </button>
      </form>

      {error ? (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold flex items-center shadow-sm">
          <span className="mr-3">🚩</span> {error}
        </div>
      ) : null}

      <div className="mt-12">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center">
          Historical Logs
          <span className="ml-4 h-px flex-1 bg-slate-100"></span>
        </h3>
        {loading ? (
          <div className="text-center py-20 text-slate-300 font-black uppercase tracking-widest text-xs animate-pulse italic">
            Retrieving history...
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">No entry logs found.</p>
          </div>
        ) : (
          <div className="overflow-hidden border border-slate-100 rounded-3xl shadow-sm bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 italic">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors duration-300 group">
                    <td className="px-6 py-4 text-sm font-black text-slate-600 group-hover:text-indigo-600 transition-colors">{r.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${r.status === "Present"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                        }`}>
                        <span className={`w-1 h-1 rounded-full mr-1.5 ${r.status === "Present" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}