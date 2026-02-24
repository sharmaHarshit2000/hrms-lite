import React, { useState } from "react";

const initial = { employee_id: "", full_name: "", email: "", department: "" };

export default function EmployeeForm({ onAdd }) {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  function update(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function validate() {
    if (!form.employee_id.trim()) return "Employee ID is required";
    if (!form.full_name.trim()) return "Full Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.department.trim()) return "Department is required";
    return "";
  }

  async function submit(e) {
    e.preventDefault();
    setLocalError("");

    const msg = validate();
    if (msg) {
      setLocalError(msg);
      return;
    }

    setSubmitting(true);
    try {
      await onAdd({
        employee_id: form.employee_id.trim(),
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        department: form.department.trim(),
      });
      setForm(initial);
    } catch {
      // error shown in App-level error
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Universal ID</label>
          <input
            className="w-full h-12 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 shadow-sm placeholder:text-slate-300"
            value={form.employee_id}
            onChange={(e) => update("employee_id", e.target.value)}
            placeholder="e.g. EMP-101"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
          <input
            className="w-full h-12 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 shadow-sm placeholder:text-slate-300"
            value={form.department}
            onChange={(e) => update("department", e.target.value)}
            placeholder="e.g. Design"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Personnel Name</label>
          <input
            className="w-full h-12 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 shadow-sm placeholder:text-slate-300"
            value={form.full_name}
            onChange={(e) => update("full_name", e.target.value)}
            placeholder="e.g. Ishaan Verma"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
          <input
            className="w-full h-12 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 shadow-sm placeholder:text-slate-300"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="e.g. ishaan@corp.com"
          />
        </div>
      </div>

      {localError ? (
        <div className="p-4 bg-amber-50 border border-amber-100 text-amber-700 rounded-2xl text-xs font-bold shadow-sm flex items-center">
          <span className="mr-3 text-lg">💡</span> {localError}
        </div>
      ) : null}

      <button
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={submitting}
      >
        {submitting ? "Processing..." : "Add to Workforce"}
      </button>
    </form>
  );
}