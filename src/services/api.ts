import axios from "axios";
import type {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

// ======================================
// Axios Instance
// ======================================

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5003/api",

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: false,

  timeout: 15000,
});

// ======================================
// Request Interceptor
// ======================================

api.interceptors.request.use(

  (config: InternalAxiosRequestConfig) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      console.log(
        "➡️",
        config.method?.toUpperCase(),
        `${config.baseURL}${config.url}`
      );

      console.log("TOKEN:", token);
    }

    return config;

  },

  (error: AxiosError) => {

    if (import.meta.env.DEV) {
      console.error("❌ Request Error:", error.message);
    }

    return Promise.reject(error);

  }

);

// ======================================
// Response Interceptor
// ======================================

api.interceptors.response.use(

  (response: AxiosResponse) => {

    if (import.meta.env.DEV) {
      console.log(
        "✅ API Response:",
        response.data
      );
    }

    return response;

  },

  (error: AxiosError) => {

    if (import.meta.env.DEV) {

      console.error(
        "❌ API Error:",
        error.response?.status
      );

      console.error(
        "Message:",
        error.response?.data || error.message
      );

    }

    // =============================
    // Unauthorized
    // =============================

    if (error.response?.status === 401) {

      console.warn("⚠️ Session Expired");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }

    }

    // =============================
    // Forbidden
    // =============================

    if (error.response?.status === 403) {

      console.warn("⛔ Access Denied");

    }

    // =============================
    // Server Error
    // =============================

    if (error.response?.status === 500) {

      console.error(
        "🚨 Internal Server Error"
      );

    }

    // =============================
    // Network Error
    // =============================

    if (!error.response) {

      console.error(
        "🌐 Network Error. Backend may be offline."
      );

    }

    return Promise.reject(error);

  }

);