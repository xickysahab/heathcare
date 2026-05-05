import React from "react";

function AppointmentTable({ data, page, perPage }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Doctor</th>
            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((a, idx) => {
            const dateObj = a.date ? new Date(a.date) : null;
            const formattedDate = dateObj
              ? dateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
              : "—";
            const formattedTime = dateObj
              ? dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
              : "";

            return (
              <tr key={a.id} className="hover:bg-blue-50/30 transition-colors duration-150">
                <td className="px-6 py-4 text-slate-400 text-sm font-mono">
                  {(page - 1) * perPage + idx + 1}
                </td>
                <td className="px-6 py-4 font-medium text-slate-800">
                  {a.patient_name || "Unknown"}
                </td>
                <td className="px-6 py-4 text-slate-700">
                  Dr. {a.doctor_name || "Unknown"}
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">
                  {formattedDate}
                  {formattedTime && (
                    <span className="text-slate-400 ml-2">{formattedTime}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentTable;
