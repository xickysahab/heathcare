import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import Reports from "./pages/Reports";
import Layout from "./components/Layout";
import DoctorCalendar from "./pages/doctor/DoctorCalendar";
import DoctorUpcoming from "./pages/doctor/DoctorUpcoming";
import DoctorPast from "./pages/doctor/DoctorPast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes (No Navbar/Footer) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes (With Navbar/Footer) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/reports" element={<Reports />} />
          
          {/* Doctor Specific Routes */}
          <Route path="/doctor/calendar" element={<DoctorCalendar />} />
          <Route path="/doctor/upcoming" element={<DoctorUpcoming />} />
          <Route path="/doctor/past" element={<DoctorPast />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

