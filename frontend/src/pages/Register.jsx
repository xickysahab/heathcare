import React, { useState, useRef, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const SPECIALTIES = [
  "Cardiologist", "Neurologist", "Physician", "Orthopedic Surgeon",
  "Pediatrician", "Psychiatrist", "Dermatologist", "Gynecologist",
  "Urologist", "General Surgeon", "Radiologist", "Oncologist",
  "Anesthesiologist", "Gastroenterologist", "Ophthalmologist",
  "ENT Specialist", "Endocrinologist", "Dentist", "Pulmonologist"
];

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "patient",
    specialty: ""
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Combine first name and last name for backend
      const payload = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        role: form.role,
      };

      if (form.role === "doctor") {
        if (!form.specialty) {
          setToast({ show: true, message: "Please specify or select a specialty.", type: "error" });
          setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
          return;
        }
        payload.specialty = form.specialty;
      }

      await API.post("/auth/register", payload);
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setToast({ show: true, message: "Registration failed. Please check your details or try another email.", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    }
  };

  // Filter specialties based on regex search
  const filteredSpecialties = SPECIALTIES.filter(s =>
    new RegExp(form.specialty, "i").test(s)
  );

  return (
    <div className="min-h-screen flex w-full bg-slate-50 font-sans absolute top-0 left-0 m-0 p-0">

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

      {/* Left side - Branding/Illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-cyan-700 items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="z-10 text-white p-12 max-w-lg text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Join Pollo Hospital</h1>
          <p className="text-blue-100 text-lg leading-relaxed">Start your healthcare journey with the most advanced and trusted medical platform.</p>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto max-h-screen">
        <div className="w-full max-w-md pb-10">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-black mb-2">Create an Account</h2>
            <p className="text-slate-500">Please fill in your details to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm box-border"
                  placeholder="John"
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm box-border"
                  placeholder="Doe"
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm box-border"
                placeholder="doctor@pollo.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm box-border"
                placeholder="••••••••"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">I am a</label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm box-border cursor-pointer appearance-none"
                  onChange={(e) => {
                    setForm({ ...form, role: e.target.value, specialty: "" });
                    setShowDropdown(false);
                  }}
                  value={form.role}
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Specialty Search Field (Only for Doctors) */}
            {form.role === "doctor" && (
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Doctor Speciality</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm box-border"
                  placeholder="Search or type specialty... (e.g. Cardiologist)"
                  value={form.specialty}
                  onChange={(e) => {
                    setForm({ ...form, specialty: e.target.value });
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                />

                {/* Searchable Dropdown List */}
                {showDropdown && filteredSpecialties.length > 0 && (
                  <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 shadow-xl max-h-48 overflow-y-auto rounded-xl custom-scrollbar">
                    {filteredSpecialties.map((spec, index) => (
                      <li
                        key={index}
                        className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-slate-700 border-b border-slate-100 last:border-0 transition-colors"
                        onClick={() => {
                          setForm({ ...form, specialty: spec });
                          setShowDropdown(false);
                        }}
                      >
                        {spec}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 active:transform active:scale-[0.98] border-none cursor-pointer mt-6"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                Sign in instead
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 transform transition-all scale-100 text-center border border-slate-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Successfully Registered</h3>
            <p className="text-slate-500 mb-8">Welcome to Pollo Hospital! Redirecting you to login...</p>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md active:scale-95 border-none cursor-pointer"
            >
              Continue to Login
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Register;