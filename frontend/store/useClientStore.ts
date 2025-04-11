import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "sonner";
import api from "@/app/api/axios";
import type { AxiosError } from "axios";

// Define User interface
interface User {
  _id: string;
  nom?: string;
  prenom?: string;
  email: string;
  telephone?: string;
  adresse?: string;
  photoProfil?: string;
  role: "client" | "restaurant" | "livreur" | "admin";
  statut: "pending" | "active" | "blocked";
  createdAt: string;
  updatedAt: string;
}

// Define Avis (Review) interface
interface Avis {
  _id: string;
  client: string | User;
  restaurant?: string | Restaurant;
  livreur?: string | User;
  commande?: string | Commande;
  note: number;
  commentaire?: string;
  createdAt: string;
  updatedAt: string;
}

// Define Restaurant interface
interface Restaurant {
  _id: string;
  nom: string;
  description?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  logo?: string;
  images?: string[];
  horaires?: Record<string, { ouverture: string; fermeture: string }>;
  proprietaire: string | User;
  statut: "open" | "closed" | "temporarily_closed";
  createdAt: string;
  updatedAt: string;
}

// Define Categorie interface
interface Categorie {
  _id: string;
  nom: string;
  description?: string;
  image?: string;
  restaurant: string | Restaurant;
  createdAt: string;
  updatedAt: string;
}

// Define Plat interface
interface Plat {
  _id: string;
  nom: string;
  description: string;
  prix: number;
  images: string[];
  videos?: string[];
  ingredients: string[];
  categorie: Categorie;
  restaurant: string | Restaurant;
  disponible: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define Commande interface (simplified for now)
interface Commande {
  _id: string;
  client: string | User;
  restaurant: string | Restaurant;
  statut: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}

// Define Profile Update interface
interface ClientProfileUpdate {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  photoProfil?: string;
}

// Define Avis Creation interface
interface AvisCreate {
  restaurant?: string;
  livreur?: string;
  commande?: string;
  note: number;
  commentaire?: string;
}

// Define Avis Update interface
interface AvisUpdate {
  note?: number;
  commentaire?: string;
}

// Define client state interface
interface ClientState {
  clientProfile: User | null;
  avis: Avis[];
  plats: Plat[];
  plat: Plat | null;
  categories: Categorie[];
  restaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;

  // Profile Actions
  getClientProfile: () => Promise<User | null>;
  updateClientProfile: (
    data: ClientProfileUpdate | FormData
  ) => Promise<boolean>;
  deleteClientAccount: () => Promise<boolean>;

  // Avis (Reviews) Actions
  createAvis: (data: AvisCreate) => Promise<Avis | null>;
  getAllAvis: () => Promise<Avis[]>;
  deleteAvis: (avisId: string) => Promise<boolean>;
  updateAvis: (avisId: string, data: AvisUpdate) => Promise<Avis | null>;

  // Plats (Dishes) Actions
  getAllDisponiblePlats: () => Promise<Plat[]>;
  getAllDisponiblePlatsOfCategorie: (categorieId: string) => Promise<Plat[]>;
  getAllDisponiblePlatsOfRestaurant: (restaurantId: string) => Promise<Plat[]>;

  getAllCategories: () => Promise<Categorie[]>;
  getAllRestaurants: () => Promise<Restaurant[]>;
  getPlatById: (platId: string) => Promise<Plat | null>;
  // Utility Actions
  clearError: () => void;
}

const useClientStore = create<ClientState>()(
  devtools((set, get) => ({
    clientProfile: null,
    avis: [],
    categories: [],
    plats: [],
    restaurants: [],
    isLoading: false,
    error: null,

    // Get Client Profile
    getClientProfile: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await api.get("/client/my-profile");
        const { user } = response.data;

        set({
          clientProfile: user,
          isLoading: false,
        });

        return user;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message ||
          "Failed to fetch client profile";

        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        return null;
      }
    },

    // Update Client Profile
    updateClientProfile: async (data: ClientProfileUpdate | FormData) => {
      set({ isLoading: true, error: null });
      try {
        // Check if data is FormData for multipart/form-data request (with image)
        const isFormData = data instanceof FormData;

        // Configure request headers based on data type
        const config = isFormData
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : undefined;

        const response = await api.put("/client/update-profile", data, config);
        const { user } = response.data;

        set({
          clientProfile: user,
          isLoading: false,
        });

        toast.success("Profile updated successfully");
        return true;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message ||
          "Failed to update client profile";

        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        return false;
      }
    },

    // Delete Client Account
    deleteClientAccount: async () => {
      set({ isLoading: true, error: null });
      try {
        await api.delete("/client/delete-account");

        set({
          clientProfile: null,
          avis: [],
          plats: [],
          isLoading: false,
        });

        toast.success("Account deleted successfully");
        return true;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message || "Failed to delete account";

        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        return false;
      }
    },

    // Create Avis (Review)
    createAvis: async (data: AvisCreate) => {
      set({ isLoading: true, error: null });
      try {
        const response = await api.post("/client/avis", data);
        const { avis } = response.data;

        // Update the avis list
        set((state) => ({
          avis: [...state.avis, avis],
          isLoading: false,
        }));

        toast.success("Review submitted successfully");
        return avis;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message || "Failed to submit review";

        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        return null;
      }
    },

    // Get All Avis (Reviews)
    getAllAvis: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await api.get("/client/avis");
        const { avis } = response.data;

        set({
          avis,
          isLoading: false,
        });

        return avis;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message || "Failed to fetch reviews";

        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        return [];
      }
    },

    // Delete Avis (Review)
    deleteAvis: async (avisId: string) => {
      set({ isLoading: true, error: null });
      try {
        await api.delete(`/client/avis/${avisId}`);

        // Remove the deleted avis from the list
        set((state) => ({
          avis: state.avis.filter((a) => a._id !== avisId),
          isLoading: false,
        }));

        toast.success("Review deleted successfully");
        return true;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message || "Failed to delete review";

        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        return false;
      }
    },

    // Update Avis (Review)
    updateAvis: async (avisId: string, data: AvisUpdate) => {
      set({ isLoading: true, error: null });
      try {
        const response = await api.put(`/client/avis/${avisId}`, data);
        const { avis } = response.data;

        // Update the avis in the list
        set((state) => ({
          avis: state.avis.map((a) => (a._id === avisId ? avis : a)),
          isLoading: false,
        }));

        toast.success("Review updated successfully");
        return avis;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message || "Failed to update review";

        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        return null;
      }
    },

    // Get All Disponible Plats (Available Dishes)
    getAllDisponiblePlats: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await api.get("/client/plats/disponible");
        const { plats } = response.data;

        set({
          plats,
          isLoading: false,
        });

        return plats;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message ||
          "Failed to fetch available dishes";

        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        return [];
      }
    },

    // Get All Disponible Plats of Categorie (Available Dishes by Category)
    getAllDisponiblePlatsOfCategorie: async (categorieId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await api.get(
          `/client/plats/disponible/categories/${categorieId}`
        );
        const { plats } = response.data;

        set({
          plats,
          isLoading: false,
        });

        return plats;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message ||
          "Failed to fetch dishes by category";

        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        return [];
      }
    },

    // Get All Disponible Plats of Restaurant (Available Dishes by Restaurant)
    getAllDisponiblePlatsOfRestaurant: async (restaurantId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await api.get(
          `/client/plats/disponible/restaurants/${restaurantId}`
        );
        const { plats } = response.data;

        set({
          plats,
          isLoading: false,
        });

        return plats;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message ||
          "Failed to fetch dishes by restaurant";

        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        return [];
      }
    },
    //getAllCategories
    getAllCategories: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await api.get("/client/plats/categories");
        const { categories } = response.data;

        set({
          categories,
          isLoading: false,
        });

        return categories;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message || "Failed to fetch categories";

        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        return [];
      }
    },
    //getAllRestaurants
    getAllRestaurants: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await api.get("/client/plats/restaurants");
        const { restaurants } = response.data;

        set({
          restaurants,
          isLoading: false,
        });

        return restaurants;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message || "Failed to fetch restaurants";

        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        return [];
      }
    },
    //getPlatById
    getPlatById: async (platId: string) => {
      set({ isLoading: true, error: null });
      try {
        console.log("platId", platId);
        const response = await api.get(`/client/plats/${platId}`);
        const { plat } = response.data;

        set({
          plat,
          isLoading: false,
        });

        return plat;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message || "Failed to fetch plat";

        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        return null;
      }
    },

    //makeComment
    makeComment: async (platId: string, comment: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await api.post(`/client/plats/${platId}/comment`, {
          comment,
        });
        const { plat } = response.data;

        set({
          plat,
          isLoading: false,
        });

        return plat;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message || "Failed to fetch plat";

        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        return null;
      }
    },
    //likePlat
    likePlat: async (platId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await api.post(`/client/plats/${platId}/like`);
        const { plat } = response.data;

        set({
          plat,
          isLoading: false,
        });

        return plat;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message || "Failed to fetch plat";

        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        return null;
      }
    },

    //getAllCommentsOnPlat
    getAllCommentsOnPlat: async (platId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await api.get(`/client/plats/${platId}/comments`);
        const { comments } = response.data;

        set({
          plat: { ...get().plat, comments },
          isLoading: false,
        });

        return comments;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message || "Failed to fetch plat";

        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        return null;
      }
    },
    // Clear error
    clearError: () => set({ error: null }),
  }))
);

export default useClientStore;
