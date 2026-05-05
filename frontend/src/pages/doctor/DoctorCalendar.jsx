import React, { useState, useEffect } from 'react';
import API from '../../services/api';

function DoctorCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // For a simple custom calendar, we just need the current month
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  useEffect(() => {
    // Fetch doctor's appointments
    // We reuse the existing patient appointments endpoint since it uses the current_user_id (which is the doctor)
    // Actually, we need to make sure the backend returns appointments where doctor_id == current_user_id
    API.get(`/patient/appointments?per_page=100`)
      .then(res => setAppointments(res.data.appointments))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderDays = () => {
    let days = [];
    // Empty slots for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-slate-50/50 border border-slate-100 rounded-xl"></div>);
    }
    
    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Find appointments for this day
      const dayAppointments = appointments.filter(a => a.date && a.date.startsWith(dateString));

      days.push(
        <div key={day} className="h-24 p-2 border border-slate-100 rounded-xl hover:shadow-md transition-shadow relative bg-white flex flex-col">
          <span className="text-sm font-semibold text-slate-500 mb-1">{day}</span>
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1">
            {dayAppointments.map(app => (
              <div key={app.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded truncate">
                {app.date.split(' ')[1]?.substring(0, 5)} - {app.patient_name}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  if (loading) return <div className="text-center py-20">Loading Calendar...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-800">My Calendar</h2>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer border-none bg-transparent">❮</button>
          <span className="font-semibold text-lg min-w-[150px] text-center">{monthNames[currentMonth]} {currentYear}</span>
          <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer border-none bg-transparent">❯</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-slate-400 uppercase text-xs tracking-wider">{day}</div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4">
          {renderDays()}
        </div>
      </div>
    </div>
  );
}

export default DoctorCalendar;
