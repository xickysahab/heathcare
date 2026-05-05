import React, { useEffect, useState } from "react";
import API from "../services/api";
import AppointmentFilter from "./appointment/AppointmentFilter";
import AppointmentTable from "./appointment/AppointmentTable";

function Appointments() {
  const [data, setData] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 5;

  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const fetchAppointments = (pg = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", pg);
    params.set("per_page", perPage);
    if (filterDoctor) params.set("doctor_id", filterDoctor);
    if (filterDate) params.set("date", filterDate);

    API.get(`/patient/appointments?${params.toString()}`)
      .then((res) => {
        setData(res.data.appointments);
        setPage(res.data.page);
        setTotalPages(res.data.total_pages);
        setTotal(res.data.total);
      })
      .catch(() => {
        setToast({ show: true, message: "Session expired or login required.", type: "error" });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
      })
      .finally(() => setLoading(false));
  };

  // Fetch doctor list for the filter dropdown
  useEffect(() => {
    API.get("/auth/users?role=doctor")
      .then((res) => setDoctors(res.data))
      .catch(() => {});
  }, []);

  // Re-fetch when page change
  useEffect(() => {
    fetchAppointments(page);
  }, [page]);

  const handleApplyFilters = () => {
    setPage(1);
    fetchAppointments(1);
  };

  const handleClearFilters = () => {
    setFilterDoctor("");
    setFilterDate("");
    setPage(1);
    // Use a slight delay or effect to ensure state is cleared before fetching
  };

  // Re-fetch when filters are explicitly cleared
  useEffect(() => {
    if (filterDoctor === "" && filterDate === "" && !loading) {
      fetchAppointments(1);
    }
  }, [filterDoctor, filterDate]);

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

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
          My Appointments
        </h2>
        <p className="text-slate-500 mt-1">
          {total} appointment{total !== 1 && "s"} found
        </p>
      </div>

      {/* Filter Component */}
      <AppointmentFilter
        doctors={doctors}
        filterDoctor={filterDoctor}
        setFilterDoctor={setFilterDoctor}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400 text-lg">No appointments found.</p>
        </div>
      ) : (
        <>
          {/* Table Component */}
          <AppointmentTable data={data} page={page} perPage={perPage} />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <p className="text-sm text-slate-500 font-medium">
                Showing Page <span className="text-slate-800">{page}</span> of <span className="text-slate-800">{totalPages}</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all border cursor-pointer ${
                    page <= 1
                      ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                      : "bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-600 shadow-sm"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all border cursor-pointer ${
                    page >= totalPages
                      ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                      : "bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-600 shadow-sm"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Appointments;