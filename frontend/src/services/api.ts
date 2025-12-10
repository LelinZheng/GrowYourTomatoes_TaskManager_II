import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Attach JWT token automatically

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log("AXIOS INTERCEPTOR TOKEN:", token);
    console.log("Sending request to:", config.url);
  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  
    return config;
});
  
export default api;
