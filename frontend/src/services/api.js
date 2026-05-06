import axios from "axios";

const API = axios.create({
  // baseURL: "http://127.0.0.1:5000/api",
  baseURL: "https://heathcare-p04x.onrender.com/api"
});

// Attach JWT token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;