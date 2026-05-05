import React, { useEffect, useState } from "react";
import API from "../../services/api";

function DoctorUpcoming() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all doctor appointments
    API.get(`/patient/appointments?per_page=100`)
      .then((res) => {
        // Filter for upcoming dates
        const now = new Date();
        const upcoming = res.data.appointments.filter(a => {
          if (!a.date) return false;
          return new Date(a.date) >= now;
        });
        
        // Sort ascending (nearest first)
        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        setData(upcoming);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Upcoming Appointments</h2>
        <p className="text-slate-500 mt-1">You have {data.length} upcoming appointments.</p>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400 text-lg">No upcoming appointments found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-emerald-50/80">
                <th className="px-6 py-3 text-xs font-semibold text-emerald-700 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-xs font-semibold text-emerald-700 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-emerald-700 uppercase tracking-wider">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((a, idx) => {
                const dateObj = new Date(a.date);
                const formattedDate = dateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
                const formattedTime = dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

                return (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-slate-400 text-sm font-mono">{idx + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{a.patient_name}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      <span className="font-semibold text-slate-700">{formattedDate}</span>
                      <span className="ml-2 text-slate-500 bg-slate-100 px-2 py-1 rounded">{formattedTime}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DoctorUpcoming;
