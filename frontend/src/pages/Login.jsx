import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user_id", res.data.user_id);   
      localStorage.setItem("username", res.data.username); 
      if (res.data.specialty_name) {
        localStorage.setItem("specialty_name", res.data.specialty_name);
      }

      // Show subtle success toast
      setToast({ show: true, message: "Login successful! Redirecting...", type: "success" });

      // Automatically redirect after 1.5s
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
      
    } catch (err) {
      setToast({ show: true, message: "Invalid Credentials. Please try again.", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50 font-sans absolute top-0 left-0 m-0 p-0">
      
      {/* Subtle Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full flex items-center gap-3 shadow-lg transition-all duration-500 animate-fade-in-down ${
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

      {/* Left side - Branding/Illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-cyan-700 items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="z-10 text-white p-12 max-w-lg text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Pollo Hospital</h1>
          <p className="text-blue-100 text-lg leading-relaxed">Providing world-class healthcare with advanced technology and compassionate care.</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-black !text-black mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-500">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm box-border"
                placeholder="patient@pollo.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm box-border"
                placeholder="••••••••"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 active:transform active:scale-[0.98] border-none cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                Register now
              </button>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;