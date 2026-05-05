import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";

function BookAppointment() {
  const [searchParams] = useSearchParams();
  const preselectedDoctor = searchParams.get("doctor") || "";

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState("Guest");
  const [patientId, setPatientId] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    doctor_id: preselectedDoctor,
    date: "",
    time: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    // Fetch logged-in user info from backend
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setPatientName(res.data.name || "Guest");
        setPatientId(res.data.id);
      } catch (err) {
        console.log("Error fetching user info", err);
        // Fallback to localStorage
        setPatientName(localStorage.getItem("username") || "Guest");
        setPatientId(localStorage.getItem("user_id"));
      }
    };

    const fetchDoctors = async () => {
      try {
        const res = await API.get("/auth/users?role=doctor");
        setDoctors(res.data);
      } catch (err) {
        console.log("Error fetching doctors", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchDoctors();
  }, []);

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  ];

  const handleSubmit = async () => {
    if (!form.doctor_id || !form.date || !form.time) {
      setToast({ show: true, message: "Please fill all fields", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
      return;
    }

    try {
      const payload = {
        patient_id: patientId,
        doctor_id: form.doctor_id,
        date: `${form.date}T${form.time}:00`,
      };
      await API.post("/patient/book", payload);
      setSubmitted(true);
    } catch (err) {
      setToast({ show: true, message: "Something went wrong. Please try again.", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    }
  };

  const selectedDoctor = doctors.find(
    (d) => String(d.id) === String(form.doctor_id)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-sm">
        Loading doctors...
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Appointment Booked!</h2>
          <p className="text-sm text-gray-500 mb-1">
            With <span className="font-medium text-gray-700">{selectedDoctor?.name}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {new Date(`${form.date}T${form.time}`).toLocaleString("en-IN", {
              weekday: "short", day: "numeric", month: "short",
              hour: "2-digit", minute: "2-digit",
            })}
          </p>
          <button
            onClick={() => { setForm({ doctor_id: "", date: "", time: "" }); setSubmitted(false); }}
            className="w-full border border-gray-300 text-gray-700 py-2 rounded-xl text-sm hover:bg-gray-50 transition border-none cursor-pointer"
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 relative">

      {/* Subtle Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full flex items-center gap-3 shadow-lg transition-all duration-500 animate-fade-in-down ${toast.type === "success"
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

      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-10 w-full max-w-lg border border-slate-100 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-50 rounded-full opacity-50 blur-3xl"></div>

        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📅</span>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Book Appointment</h2>
          </div>
          <p className="text-sm font-medium text-slate-400 mb-8 ml-9">Fill in the details to schedule your visit</p>
        </div>

        {/* Patient Info Card */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100/50 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-blue-600 shadow-inner flex items-center justify-center text-white text-lg font-bold uppercase">
            {patientName.charAt(0)}
          </div>
          <div>
            <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">Booking as</p>
            <p className="text-sm font-bold text-slate-800">{patientName}</p>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          {/* Doctor Select */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">
              Select Doctor
            </label>
            <div className="relative">
              <select
                value={form.doctor_id}
                onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
                className="w-full appearance-none border border-slate-200 bg-slate-50 hover:bg-slate-100/50 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
              >
                <option value="">-- Choose a Doctor --</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">
              Select Date
            </label>
            <input
              type="date"
              min={today}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value, time: "" })}
              className="w-full border border-slate-200 bg-slate-50 hover:bg-slate-100/50 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
            />
          </div>

          {/* Time Slots */}
          {form.date && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Select Time Slot
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setForm({ ...form, time: slot })}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm
                      ${form.time === slot
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md scale-105"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        {form.doctor_id && form.date && form.time && (
          <div className="mt-8 mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-in fade-in duration-300 relative z-10">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div className="text-sm">
              <p className="text-emerald-800 font-medium">Ready to book with <span className="font-bold">Dr. {selectedDoctor?.name}</span></p>
              <p className="text-emerald-600/80 font-semibold text-xs mt-0.5">
                {new Date(`${form.date}T${form.time}`).toLocaleString("en-IN", {
                  weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl text-sm font-bold transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 border-none cursor-pointer relative z-10"
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  );
}

export default BookAppointment;
