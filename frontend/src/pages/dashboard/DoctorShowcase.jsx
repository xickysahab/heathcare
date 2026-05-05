import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const avatarGradients = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-sky-600",
];

function DoctorShowcase() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/auth/users?role=doctor")
      .then((res) => setDoctors(res.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  if (loading) {
    return (
      <section className="text-center py-12">
        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="inline-block px-4 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-3">Our Team</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">Meet Our Doctors</h2>
          <p className="text-slate-500 mt-2">Experienced specialists dedicated to your well-being</p>
        </div>
        {doctors.length > 3 && (
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll("left")} className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-all cursor-pointer shadow-sm">❮</button>
            <button onClick={() => scroll("right")} className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-all cursor-pointer shadow-sm">❯</button>
          </div>
        )}
      </div>

      {doctors.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-blue-50/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👨‍⚕️</span>
          </div>
          <p className="text-lg font-bold text-slate-800">No doctors registered yet.</p>
        </div>
      ) : (
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-8 pt-4 px-2 scroll-smooth" style={{ scrollbarWidth: "none" }}>
          {doctors.map((doc, i) => (
            <div key={doc.id} className="flex-shrink-0 w-[300px] bg-white rounded-[2rem] border border-slate-100/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              {/* Decorative top background */}
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50/50 to-white"></div>
              
              <div className="flex justify-center mb-6 relative z-10">
                <div className={`w-24 h-24 rounded-[1.5rem] bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/20 group-hover:scale-105 group-hover:-rotate-3 transition-all duration-500`}>
                  {doc.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              </div>
              <div className="text-center relative z-10">
                <h3 className="font-extrabold text-slate-800 text-xl tracking-tight group-hover:text-blue-600 transition-colors">Dr. {doc.name}</h3>
                <p className="text-sm font-medium text-slate-400 mt-1.5 uppercase tracking-wide">{doc.specialty_name || "General Physician"}</p>
                
                <div className="flex justify-center gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className={`w-4 h-4 ${s <= 4 ? "text-amber-400 drop-shadow-sm" : "text-slate-100"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <button onClick={() => navigate(`/book?doctor=${doc.id}`)} className="mt-8 w-full py-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/25 text-sm font-bold transition-all duration-300 border-none cursor-pointer">
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default DoctorShowcase;
