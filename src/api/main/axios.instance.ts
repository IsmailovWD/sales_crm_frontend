import axios from "axios";
import { useErrorStore, type ErrorStoreType } from "@/stores/error";
import router from "@/router";

const baseURL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const hostname = window.location.hostname;
    if (token || config.url === "/api/v1/auth/signin") {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      router.push({ name: "signin" });
      throw new Error("Token not found");
    }
    config.headers["Accept-Language"] =
      localStorage.getItem("language") || "uz";

    config.headers["x-tenant-id"] = /*"demo.uz"*/ hostname;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const data = error.response.data;
      if (!data.success) {
        const { setError } = useErrorStore();
        let errors: ErrorStoreType = {
          new: true,
          message: data.message,
        };
        if (Array.isArray(data.errors)) {
          errors.errors = data.errors;
        }
        setError(errors);
        if (data.statusCode === 401) {
          localStorage.removeItem("token");
          router.push({ name: "signin" });
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
