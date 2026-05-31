import axios from 'axios';

// Create a pre-configured Axios instance for communicating with the FastAPI AI server
const aiAxios = axios.create({
  // Base URL of the FastAPI service
  baseURL: 'http://localhost:8000',

  // Do not send cookies or credentials (since this service runs independently and doesn’t require auth headers or session cookies)
  withCredentials: false,
});

// Export the configured instance for use in AI-related API calls (e.g., /api/verify)
export default aiAxios;
