import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { toast } from "sonner";
import api from "@/app/api/axios";
import type { AxiosError } from "axios";

// Define User interface based on the mongoose schema
interface User {
  _id: string;
  nom?: string;
  prenom?: string;
  email: string;
  telephone: string;
  adresse: string;
  photoProfil?: string;
  role: "client" | "restaurant" | "livreur" | "admin";
  disponibilite?: boolean;
  statut: "pending" | "active" | "blocked";
  createdAt: string;
  updatedAt: string;
  restaurantDetails?: any; // For restaurant users
}

// Define registration data interface
interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  adresse: string;
}

// Define login data interface
interface LoginData {
  email: string;
  motDePasse: string;
}

// Define auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  error: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFetching: boolean;

  // Actions
  register: (data: RegisterData) => Promise<boolean>;
  login: (data: LoginData) => Promise<boolean>;
  logout: () => Promise<void>;
  getLoggedUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        error: null,
        isAuthenticated: false,
        isLoading: false,
        isFetching: false,

        // Register a new user
        register: async (data: RegisterData) => {
          console.log("Registering user:", data);
          set({ isLoading: true, error: null });
          try {
            const response = await api.post("/auth/register", data);
            const { token, user } = response.data;

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
            console.log("Registration response:", response.data);
            toast.success("Registration successful!");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Registration failed";
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            return false;
          }
        },

        // Login user
        login: async (data: LoginData) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.post("/auth/login", data);
            const { token, user } = response.data;

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });

            toast.success("Login successful!");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Login failed";
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            return false;
          }
        },

        // Logout user
        logout: async () => {
          set({ isLoading: true });
          try {
            // The token will be added by the axios interceptor
            await api.post("/auth/logout");

            // Clear auth state after successful logout
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });

            toast.success("Logout successful!");
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Logout failed";

            console.error("Logout error:", error);

            // Even if the server request fails, clear the local auth state
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: errorMessage,
            });

            toast.error(errorMessage);
          }
        },

        // Get logged in user data based on role
        getLoggedUser: async () => {
          const { user } = get();
          if (!user) return;

          set({ isFetching: true });
          try {
            // Determine endpoint based on user role
            const role = user?.role || "client"; // Default to client if no role
            const response = await api.get(`/auth/me/${role}`);

            set({
              user: response.data.data.user,
              isFetching: false,
              isAuthenticated: true,
            });
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to fetch user data";

            // If unauthorized, clear user data
            if (axiosError.response?.status === 401) {
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                isFetching: false,
                error: errorMessage,
              });
            } else {
              set({ error: errorMessage, isFetching: false });
              toast.error(errorMessage);
            }
          }
        },

        // Clear error
        clearError: () => set({ error: null }),

        // Set user manually (useful for testing or manual updates)
        setUser: (user) => set({ user, isAuthenticated: !!user }),
      }),
      {
        name: "auth-storage", // name of the item in localStorage
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }), // only persist these fields
      }
    )
  )
);

export default useAuthStore;
