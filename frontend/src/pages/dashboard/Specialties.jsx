import React, { useState } from "react";

const specialties = [
  {
    icon: "🫀",
    name: "Cardiology",
    description:
      "Comprehensive heart care including diagnostics, interventional procedures, and cardiac surgery.",
    color: "from-red-500 to-rose-600",
    bg: "bg-red-50",
  },
  {
    icon: "🧠",
    name: "Neurology",
    description:
      "Expert treatment for brain, spine, and nervous system disorders with advanced neuroimaging.",
    color: "from-purple-500 to-indigo-600",
    bg: "bg-purple-50",
  },
  {
    icon: "🦴",
    name: "Orthopedics",
    description:
      "Joint replacements, sports medicine, and fracture care with minimally invasive techniques.",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
  },
  {
    icon: "👶",
    name: "Pediatrics",
    description:
      "Specialized child healthcare from newborn care to adolescent medicine in a child-friendly environment.",
    color: "from-sky-500 to-blue-600",
    bg: "bg-sky-50",
  },
  {
    icon: "🔬",
    name: "Oncology",
    description:
      "Multidisciplinary cancer treatment with chemotherapy, radiation therapy, and surgical oncology.",
    color: "from-teal-500 to-emerald-600",
    bg: "bg-teal-50",
  },
  {
    icon: "👁️",
    name: "Ophthalmology",
    description:
      "Complete eye care including LASIK, cataract surgery, and retinal treatments.",
    color: "from-cyan-500 to-blue-600",
    bg: "bg-cyan-50",
  },
  {
    icon: "🫁",
    name: "Pulmonology",
    description:
      "Respiratory care for asthma, COPD, sleep disorders, and critical pulmonary conditions.",
    color: "from-green-500 to-emerald-600",
    bg: "bg-green-50",
  },
  {
    icon: "🧬",
    name: "Dermatology",
    description:
      "Skin, hair, and nail treatments including cosmetic dermatology and laser procedures.",
    color: "from-pink-500 to-rose-600",
    bg: "bg-pink-50",
  },
];

function Specialties() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section>
      {/* Section Header */}
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-3">
          What We Offer
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
          Our Specialties
        </h2>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto">
          World-class medical departments staffed by experienced specialists
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {specialties.map((spec, index) => (
          <div
            key={spec.name}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`relative group p-8 rounded-[2rem] bg-white cursor-default transition-all duration-500 overflow-hidden ${
              hoveredIndex === index
                ? "shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] -translate-y-2"
                : "shadow-sm border border-slate-100"
            }`}
          >
            {/* Soft background glow on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${spec.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

            {/* Gradient top bar on hover */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${spec.color} transition-all duration-500 ${
                hoveredIndex === index ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}
            />

            {/* Icon */}
            <div
              className={`w-16 h-16 rounded-2xl ${spec.bg} flex items-center justify-center text-3xl mb-6 transition-all duration-500 ${
                hoveredIndex === index ? "scale-110 shadow-lg" : ""
              }`}
            >
              {spec.icon}
            </div>

            {/* Text */}
            <h3 className={`font-extrabold text-xl mb-3 transition-colors duration-300 ${hoveredIndex === index ? "text-slate-900" : "text-slate-800"}`}>
              {spec.name}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              {spec.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Specialties;
