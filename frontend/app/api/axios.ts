import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // If using authentication (cookies, JWT)
});

// Request Interceptor: Attach token if needed
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    console.log("Sending request to:", config.url);
    return config;
  },
  (error: AxiosError): Promise<never> => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<never> => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
