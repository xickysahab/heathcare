import React, { useEffect, useState } from "react";

const testimonials = [
  { name: "Ananya Sharma", rating: 5, text: "The doctors were incredibly attentive. My surgery went smoothly and the recovery was faster than expected. Highly recommend Pollo Hospital!", time: "2 weeks ago" },
  { name: "Rahul Verma", rating: 5, text: "Best cardiac care I've ever received. Dr. Mehta explained every step and the nursing staff was very supportive throughout my stay.", time: "1 month ago" },
  { name: "Priya Patel", rating: 4, text: "Clean facilities, modern equipment, and a caring team. The only downside was the wait time, but the quality of care made up for it.", time: "3 weeks ago" },
  { name: "Amit Joshi", rating: 5, text: "My daughter's pediatric treatment was handled with such care. The child-friendly ward made her feel comfortable and safe.", time: "1 month ago" },
  { name: "Sneha Reddy", rating: 4, text: "Excellent orthopedic department. My knee replacement was a success and the physiotherapy team was very encouraging.", time: "2 months ago" },
  { name: "Vikram Singh", rating: 5, text: "From reception to discharge, every staff member was professional and kind. Pollo Hospital sets the gold standard for healthcare.", time: "3 weeks ago" },
];

const avatarColors = [
  "bg-blue-500", "bg-emerald-500", "bg-violet-500",
  "bg-rose-500", "bg-amber-500", "bg-cyan-500",
];

function Reviews() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Show 3 reviews at a time on desktop
  const getVisibleReviews = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(current + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section>
      {/* Section Header */}
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold uppercase tracking-wider mb-3">
          Testimonials
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
          What Patients Say
        </h2>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto">
          Real stories from real patients who trusted us with their care
        </p>
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {getVisibleReviews().map((review, index) => (
          <div
            key={`${review.name}-${index}`}
            className="group bg-white rounded-[2rem] border border-slate-100/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(245,_158,_11,_0.1)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
          >
            {/* Quote watermark icon */}
            <div className="absolute -top-4 -right-4 text-8xl text-amber-500/5 font-serif pointer-events-none group-hover:scale-110 transition-transform duration-500">
              "
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-6 relative z-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${star <= review.rating ? "text-amber-400 drop-shadow-sm" : "text-slate-100"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Quote */}
            <p className="text-slate-600 text-[15px] leading-relaxed mb-8 italic relative z-10 font-medium">
              "{review.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4 pt-5 border-t border-slate-100/60 relative z-10">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-inner flex items-center justify-center text-white font-extrabold text-lg`}>
                {review.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm tracking-tight">{review.name}</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-0.5">{review.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 border-none cursor-pointer ${
              index === current ? "w-8 bg-amber-400" : "w-2 bg-slate-200 hover:bg-slate-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default Reviews;
