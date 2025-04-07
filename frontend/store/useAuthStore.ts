import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { toast } from "sonner";
import api from "@/app/api/axios";

// Define User interface based on the mongoose schema
interface User {
  _id: string;
  nom: string;
  prenom: string;
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
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
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
          set({ isLoading: true, error: null });
          try {
            const response = await api.post("/register", data);
            const { token, user } = response.data;

            // Set token in axios headers for future requests
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });

            toast.success("Registration successful!");
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message || "Registration failed";
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
          }
        },

        // Login user
        login: async (data: LoginData) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.post("/login", data);
            const { token, user } = response.data;

            // Set token in axios headers for future requests
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });

            toast.success("Login successful!");
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message || "Login failed";
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
          }
        },

        // Logout user
        logout: async () => {
          set({ isLoading: true });
          try {
            await api.post("/logout");

            // Remove token from axios headers
            delete api.defaults.headers.common["Authorization"];

            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });

            toast.success("Logout successful!");
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message || "Logout failed";
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
          }
        },

        // Get logged in user data based on role
        getLoggedUser: async () => {
          const { token, user } = get();
          if (!token) return;

          set({ isFetching: true });
          try {
            // Set token in axios headers
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // Determine endpoint based on user role
            const role = user?.role || "client"; // Default to client if no role
            const response = await api.get(`/me/${role}`);

            set({
              user: response.data.data.user,
              isFetching: false,
              isAuthenticated: true,
            });
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message || "Failed to fetch user data";

            // If unauthorized, clear user data
            if (error.response?.status === 401) {
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
