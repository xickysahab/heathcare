import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function DoctorSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Doctor';
  const specialty = localStorage.getItem('specialty_name') || 'Specialist';

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] transition-opacity" 
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[70] flex flex-col transform transition-transform duration-300">
        
        {/* Header & Close */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Dr. {username}</h3>
              <p className="text-sm font-medium text-emerald-600">{specialty}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer border-none bg-transparent"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 py-6 px-4 flex flex-col gap-2">
          <Link 
            to="/doctor/calendar"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              location.pathname === '/doctor/calendar' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="text-xl">📅</span> Overview / Calendar
          </Link>
          
          <Link 
            to="/doctor/upcoming"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              location.pathname === '/doctor/upcoming' 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="text-xl">🕒</span> Upcoming Appointments
          </Link>

          <Link 
            to="/doctor/past"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              location.pathname === '/doctor/past' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="text-xl">📁</span> Past Appointments (Reports)
          </Link>
        </div>

      </div>
    </>
  );
}

export default DoctorSidebar;
