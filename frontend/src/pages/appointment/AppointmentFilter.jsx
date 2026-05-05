import React from "react";

function AppointmentFilter({
  doctors,
  filterDoctor,
  setFilterDoctor,
  filterDate,
  setFilterDate,
  onApply,
  onClear,
}) {
  return (
    <div className="flex flex-wrap items-end gap-4 mb-6 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
      {/* Doctor Filter */}
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Doctor
        </label>
        <select
          value={filterDoctor}
          onChange={(e) => setFilterDoctor(e.target.value)}
          className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition cursor-pointer appearance-none"
        >
          <option value="">All Doctors</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              Dr. {doc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date Filter */}
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Date
        </label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onApply}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm border-none cursor-pointer"
        >
          Apply
        </button>
        <button
          onClick={onClear}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-xl transition-all border-none cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default AppointmentFilter;
