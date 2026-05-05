import React, { useEffect, useState } from "react";
import API from "../services/api";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    API.get(`/patient/appointments?per_page=100`)
      .then((res) => {
        // Filter out appointments that don't have a report
        const withReports = res.data.appointments.filter(a => a.has_report);
        // Sort by date descending (newest first)
        withReports.sort((a, b) => new Date(b.date) - new Date(a.date));
        setReports(withReports);
      })
      .catch((err) => console.error("Error fetching reports", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadFile = (appointmentId, fileName) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch the file as a blob so we can pass the authorization header
    fetch(`http://127.0.0.1:5000/api/patient/report/file/${appointmentId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch file");
        return response.blob();
      })
      .then(blob => {
        // Create a temporary link to trigger the download/view
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // forces download
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(err => console.error(err));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500 font-medium">
        Loading your reports...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">My Medical Reports</h2>
        <p className="text-slate-500 mt-1">View your prescriptions, doctor notes, and uploaded files.</p>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
          <div className="w-20 h-20 bg-blue-50/80 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-inner">
            <span className="text-4xl">🗂️</span>
          </div>
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">No Reports Found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-3 text-sm leading-relaxed">
            You don't have any medical reports yet. Once a doctor uploads your prescription or test results, they will securely appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((r) => {
            const dateObj = new Date(r.date);
            const formattedDate = dateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

            return (
              <div key={r.id} className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
                {/* Subtle top gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center text-2xl font-black shadow-sm border border-blue-100/50">
                      {r.doctor_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-700 transition-colors">{r.doctor_name}</h3>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{formattedDate}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-4 mb-6 border border-slate-100/50 flex-1 relative group-hover:bg-blue-50/30 transition-colors">
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {r.report_text || <span className="italic text-slate-400">No prescription notes added.</span>}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50/80 group-hover:from-blue-50/30 to-transparent transition-colors"></div>
                </div>

                <div className="flex items-center gap-3 mt-auto pt-2">
                  <button
                    onClick={() => setSelectedReport(r)}
                    className="flex-1 bg-white border border-slate-200 group-hover:border-blue-200 text-slate-700 group-hover:text-blue-700 font-semibold py-3 rounded-xl text-sm transition-all hover:bg-blue-50 cursor-pointer shadow-sm"
                  >
                    Read Notes
                  </button>
                  {r.report_file_name && (
                    <button
                      onClick={() => handleDownloadFile(r.id, r.report_file_name)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-md hover:shadow-lg border-none cursor-pointer flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      File
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Reading Full Report */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 transform scale-100 transition-transform">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-50 to-white px-8 py-6 border-b border-slate-100 flex justify-between items-center relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">📝</span>
                  <h3 className="font-bold text-2xl text-slate-800 tracking-tight">Prescription Details</h3>
                </div>
                <p className="text-sm font-medium text-slate-500 ml-9">Consultation with <span className="text-blue-600">{selectedReport.doctor_name}</span></p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all cursor-pointer relative z-10"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/30">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[200px] relative overflow-hidden">
                {/* Decorative watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] text-[10rem] pointer-events-none font-serif">
                  Rx
                </div>

                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Doctor's Notes & Medications</h4>

                {selectedReport.report_text ? (
                  <p className="text-slate-700 whitespace-pre-wrap text-[15px] leading-relaxed font-medium relative z-10">
                    {selectedReport.report_text}
                  </p>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-center relative z-10">
                    <span className="text-slate-300 text-3xl mb-2">➖</span>
                    <p className="text-slate-400 italic font-medium">No additional text notes provided.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            {selectedReport.report_file_name && (
              <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Attached Document</p>
                    <p className="text-sm font-bold text-slate-700 truncate max-w-[200px] sm:max-w-xs">{selectedReport.report_file_name}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadFile(selectedReport.id, selectedReport.report_file_name)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all shadow-md hover:shadow-lg border-none cursor-pointer flex-shrink-0 flex items-center gap-2"
                >
                  Download
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
