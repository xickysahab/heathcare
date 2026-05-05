import React, { useEffect, useState } from "react";
import API from "../../services/api";

function DoctorPast() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [reportText, setReportText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchPastAppointments();
  }, []);

  const fetchPastAppointments = () => {
    API.get(`/patient/appointments?per_page=100`)
      .then((res) => {
        const now = new Date();
        const past = res.data.appointments.filter(a => {
          if (!a.date) return false;
          return new Date(a.date) < now;
        });
        past.sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest past first
        setData(past);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppt) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("appointment_id", selectedAppt.id);
    formData.append("patient_id", selectedAppt.patient_id);
    if (reportFile) {
      formData.append("file", reportFile);
    }
    formData.append("text", reportText);

    try {
      await API.post("/patient/report", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setToast({ show: true, message: "Report saved successfully!", type: "success" });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
      closeModal();
      fetchPastAppointments();
    } catch (err) {
      setToast({ show: true, message: "Error uploading report.", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const closeModal = () => {
    setSelectedAppt(null);
    setReportFile(null);
    setReportText("");
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative">
      
      {/* Subtle Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full flex items-center gap-3 shadow-lg transition-all duration-500 animate-fade-in-down ${
          toast.type === "success" 
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {toast.type === "success" ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Past Appointments</h2>
        <p className="text-slate-500 mt-1">Upload reports and prescriptions for completed appointments.</p>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400 text-lg">No past appointments found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-indigo-50/80">
                <th className="px-6 py-3 text-xs font-semibold text-indigo-700 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-xs font-semibold text-indigo-700 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-indigo-700 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-xs font-semibold text-indigo-700 uppercase tracking-wider text-right">Action</th>
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
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          setSelectedAppt(a);
                          setReportText(a.report_text || "");
                        }}
                        className={`px-4 py-2 text-white text-sm font-semibold rounded-lg transition-all border-none cursor-pointer ${
                          a.has_report 
                            ? "bg-teal-600 hover:bg-teal-700" 
                            : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                      >
                        {a.has_report ? "View/Edit Report" : "Upload Report"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">
                {selectedAppt.has_report ? "Edit Report:" : "Upload Report:"} {selectedAppt.patient_name}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer text-xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="p-6">
              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Upload File (PDF/Image)</label>
                
                {selectedAppt.report_file_name && (
                  <div className="mb-3 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-100 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Previous File: <span className="font-semibold">{selectedAppt.report_file_name}</span>
                  </div>
                )}

                <input 
                  type="file" 
                  accept=".pdf,image/*"
                  onChange={(e) => setReportFile(e.target.files[0])}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                {selectedAppt.has_report && <p className="text-xs text-slate-400 mt-2">Uploading a new file will overwrite the existing one.</p>}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Medicines & Notes</label>
                <textarea 
                  rows="4" 
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Write prescription notes or diagnosis here..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none custom-scrollbar"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-5 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed border-none cursor-pointer"
                >
                  {uploading ? "Saving..." : (selectedAppt.has_report ? "Update Report" : "Submit Report")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorPast;
