import React, { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import Layout from "./components/Layout";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import AttendancePanel from "./components/AttendancePanel";

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedEmployee = useMemo(
    () => employees.find((e) => e.id === selectedId) || null,
    [employees, selectedId]
  );

  async function refresh() {
    setError("");
    setLoading(true);
    try {
      const list = await api.listEmployees();
      setEmployees(list);
      if (list.length === 0) setSelectedId(null);
      else if (selectedId && !list.find((e) => e.id === selectedId)) setSelectedId(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onAdd(payload) {
    setError("");
    try {
      const created = await api.addEmployee(payload);
      setEmployees((prev) => [created, ...prev]);
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }

  async function onDelete(id) {
    setError("");
    try {
      await api.deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <section className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Employee Registry</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">Manage your team and records.</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>

          <EmployeeForm onAdd={onAdd} />
          {error ? (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </div>
          ) : null}

          <div className="mt-12">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center">
              Active Directory
              <span className="ml-3 h-px flex-1 bg-slate-100"></span>
            </h3>
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Synchronizing...</p>
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">No records found.</p>
              </div>
            ) : (
              <EmployeeList
                employees={employees}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onDelete={onDelete}
              />
            )}
          </div>
        </section>

        <section className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-32 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Attendance</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">Status tracking & historical logs.</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>

          {!selectedEmployee ? (
            <div className="text-center py-32 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 group">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Select a profile to proceed</p>
            </div>
          ) : (
            <AttendancePanel employee={selectedEmployee} />
          )}
        </section>
      </div>
    </Layout>
  );
}