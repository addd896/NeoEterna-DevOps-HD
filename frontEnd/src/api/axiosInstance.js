import axios from 'axios';

// Create a reusable Axios instance for the main Express backend (port 5000)
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL for all API requests
  withCredentials: true,               // Include cookies in requests (useful for session auth if enabled)
});

// Interceptor: Automatically attach the JWT token from localStorage (if available)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve JWT from localStorage

  if (token) {
    // Set Authorization header with Bearer scheme
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config; // Return modified config
});

// Export this instance to use in your frontend app
// Example: axiosInstance.get('/auth/me') or axiosInstance.post('/capsules/create', formData)
export default axiosInstance;
