// API Configuration
const API_URL = import.meta.env.VITE_API_URL;

export const config = {
  apiUrl: API_URL,
  endpoints: {
    auth: `${API_URL}/api/auth`,
    jobs: `${API_URL}/api/jobs`,
    applications: `${API_URL}/api/applications`,
    admin: `${API_URL}/api/admin`,
    courses: `${API_URL}/api/courses`,
    reviews: `${API_URL}/api/reviews`,
    enrollments: `${API_URL}/api/enrollments`,
  }
};

// Helper function to get API URL
export const getApiUrl = (path: string = '') => {
  const baseUrl = import.meta.env.VITE_API_URL;
  return path ? `${baseUrl}${path}` : baseUrl;
};

export default config;
