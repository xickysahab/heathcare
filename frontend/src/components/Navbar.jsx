import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const navLinks = [
    { name: "Home", path: "/dashboard" },
    { name: "Book Appointment", path: "/book" },
    { name: "View Report", path: "/reports" },
    { name: "Appointment History", path: "/appointments" }
  ];

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => navigate('/dashboard')}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:shadow-blue-500/30 group-hover:-translate-y-0.5 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">Pollo<span className="text-blue-600">.</span></span>
            </div>

            {/* Links */}
            <div className="hidden md:flex space-x-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.name}
                    to={link.path}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 shadow-inner' 
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-3">
              {role === 'doctor' && (
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-100 bg-transparent cursor-pointer"
                  title="Doctor Menu"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}

              <button 
                onClick={handleLogout}
                className="ml-2 inline-flex items-center px-5 py-2.5 border border-slate-200 text-sm font-bold rounded-xl text-slate-600 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm cursor-pointer"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Doctor Sidebar */}
      <DoctorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

export default Navbar;
