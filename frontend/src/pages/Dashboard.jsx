import React from "react";
import HeroSlider from "./dashboard/HeroSlider";
import Specialties from "./dashboard/Specialties";
import DoctorShowcase from "./dashboard/DoctorShowcase";
import Reviews from "./dashboard/Reviews";

function Dashboard() {
  return (
    <div className="space-y-16 pb-8">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Our Specialties */}
      <Specialties />

      {/* Meet Our Doctors */}
      <DoctorShowcase />

      {/* Patient Reviews */}
      <Reviews />
    </div>
  );
}

export default Dashboard;