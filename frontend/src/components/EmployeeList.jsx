import React from "react";

export default function EmployeeList({ employees, selectedId, onSelect, onDelete }) {
  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      {employees.map((e) => (
        <div
          key={e.id}
          className={`flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 cursor-pointer group relative overflow-hidden ${selectedId === e.id
              ? "bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-100 -translate-y-1"
              : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100"
            }`}
          onClick={() => onSelect(e.id)}
          role="button"
          tabIndex={0}
        >
          <div className="flex-1 min-w-0 flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-colors duration-300 ${selectedId === e.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
              }`}>
              {e.full_name.charAt(0)}
            </div>
            <div>
              <div className={`font-black truncate transition-colors duration-300 ${selectedId === e.id ? "text-white" : "text-slate-800"
                }`}>
                {e.full_name}
              </div>
              <div className="flex items-center space-x-3 mt-1 underline-offset-4">
                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${selectedId === e.id ? "text-indigo-200" : "text-slate-400"
                  }`}>
                  {e.employee_id}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${selectedId === e.id ? "text-indigo-200" : "text-slate-400"
                  }`}>
                  •
                </span>
                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${selectedId === e.id ? "text-indigo-200" : "text-slate-400"
                  }`}>
                  {e.department}
                </span>
              </div>
            </div>
          </div>

          <button
            className={`ml-4 p-2.5 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 ${selectedId === e.id
                ? "bg-white/10 text-white/50 hover:text-white hover:bg-white/20"
                : "text-slate-300 hover:text-rose-500 hover:bg-rose-50"
              }`}
            onClick={(ev) => {
              ev.stopPropagation();
              if (confirm(`Delete ${e.full_name}?`)) onDelete(e.id);
            }}
            title="Remove Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}