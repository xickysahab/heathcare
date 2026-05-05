import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../../assets/roomview.png";
import img2 from "../../assets/mainview.png";
import img3 from "../../assets/operationtheatre.png";

const slides = [
  {
    image: img1,
    title: "World-Class Patient Rooms",
    subtitle: "Experience comfort and care in our state-of-the-art facilities",
  },
  {
    image: img2,
    title: "Modern Healthcare Campus",
    subtitle: "A healing environment designed with you in mind",
  },
  {
    image: img3,
    title: "Advanced Operation Theatres",
    subtitle: "Equipped with cutting-edge surgical technology",
  },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Guest";

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide((current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [current]);

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const nextSlide = () => goToSlide((current + 1) % slides.length);
  const prevSlide = () =>
    goToSlide(current === 0 ? slides.length - 1 : current - 1);

  return (
    <div className="relative w-full h-[420px] md:h-[520px] rounded-2xl overflow-hidden shadow-2xl group">
      {/* Images */}
      {slides.map((slide, index) => (
        <img
          key={index}
          src={slide.image}
          alt={slide.title}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ${
            index === current ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
        />
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        {/* Welcome Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-sm font-medium border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Welcome back, {username}
          </span>
        </div>

        {/* Slide Text */}
        <h2
          className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight transition-all duration-500"
          key={`title-${current}`}
        >
          {slides[current].title}
        </h2>
        <p
          className="text-white/80 text-base md:text-lg max-w-xl mb-6"
          key={`sub-${current}`}
        >
          {slides[current].subtitle}
        </p>

        {/* CTA Button */}
        <div>
          <button
            onClick={() => navigate("/book")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 active:scale-[0.97] border-none cursor-pointer text-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Book an Appointment
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 cursor-pointer"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 cursor-pointer"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 border-none cursor-pointer ${
              index === current
                ? "w-8 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroSlider;
