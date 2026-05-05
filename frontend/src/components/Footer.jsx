import React from 'react';

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-bold text-xl text-white tracking-tight">Pollo Hospital</span>
          </div>
          <p className="text-sm text-slate-400 max-w-xs">
            Providing world-class healthcare with advanced technology and compassionate care since 1995.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/book" className="hover:text-white transition-colors">Book Appointment</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Find a Doctor</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Emergency Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center text-blue-400 font-bold text-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              1-800-POLLO-ER
            </li>
            <li className="text-slate-400 mt-4">123 Health Avenue, Medical District</li>
            <li className="text-slate-400">support@pollohospital.com</li>
          </ul>
        </div>

      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
        &copy; {new Date().getFullYear()} Pollo Hospital. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
