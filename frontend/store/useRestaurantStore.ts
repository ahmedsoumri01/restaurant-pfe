import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { toast } from "sonner";
import api from "@/app/api/axios";
import type { AxiosError } from "axios";

// Define Restaurant interface based on the mongoose schema
interface Restaurant {
  _id: string;
  proprietaire: string;
  nom: string;
  adresse: string;
  telephone: string;
  description: string;
  workingHours: {
    from: string;
    to: string;
  };
  images: string[];
  categories: string[];
  createdAt: string;
  updatedAt: string;
}

// Define Category interface based on the mongoose schema
interface Category {
  _id: string;
  nom: string;
  description: string;
  image: string;
  restaurant: string;
  createdAt: string;
  updatedAt: string;
}

// Define Profile Update interface
interface ProfileUpdate {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  photoProfil?: string;
}

// Define Restaurant Creation/Update interface
interface RestaurantData {
  nom: string;
  adresse: string;
  telephone: string;
  description: string;
  workingHours: {
    from: string;
    to: string;
  };
  images?: string[];
}

// Define Category Creation/Update interface
interface CategoryData {
  nom: string;
  description: string;
  image?: string;
}

// Define restaurant state interface
interface RestaurantState {
  ownerProfile: any | null; // User and associated restaurant data
  restaurant: Restaurant | null;
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Owner Profile Actions
  getOwnerProfile: () => Promise<any | null>;
  updateOwnerProfile: (data: ProfileUpdate | FormData) => Promise<boolean>;
  updateOwnerPassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<boolean>;

  // Restaurant Actions
  checkRestaurantDataCompleted: () => Promise<boolean>;
  completeRestaurantInformation: (
    data: RestaurantData | FormData
  ) => Promise<boolean>;
  updateRestaurantInformation: (
    data: RestaurantData | FormData
  ) => Promise<boolean>;

  // Category Actions
  getAllCategories: () => Promise<Category[]>;
  createCategory: (data: CategoryData | FormData) => Promise<boolean>;
  updateCategory: (
    categoryId: string,
    data: CategoryData | FormData
  ) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;

  // Utility Actions
  clearError: () => void;
}

const useRestaurantStore = create<RestaurantState>()(
  devtools(
    persist(
      (set, get) => ({
        ownerProfile: null,
        restaurant: null,
        categories: [],
        isLoading: false,
        error: null,

        // Get My Owner Profile
        getOwnerProfile: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.get("/restaurant/my-profile");
            const { user, restaurant } = response.data;

            set({
              ownerProfile: { user, restaurant },
              isLoading: false,
            });

            return { user, restaurant };
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message ||
              "Failed to fetch owner profile";

            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            return null;
          }
        }, //work successfully

        // Update My Profile
        updateOwnerProfile: async (data: ProfileUpdate | FormData) => {
          set({ isLoading: true, error: null });
          try {
            const isFormData = data instanceof FormData;
            const config = isFormData
              ? { headers: { "Content-Type": "multipart/form-data" } }
              : undefined;

            const response = await api.put(
              "/restaurant/update-profile",
              data,
              config
            );
            const { user } = response.data;

            set({
              ownerProfile: { ...get().ownerProfile, user },
              isLoading: false,
            });

            toast.success("Profile updated successfully");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to update profile";

            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            return false;
          }
        }, //work successfully

        // Update My Password
        updateOwnerPassword: async (
          oldPassword: string,
          newPassword: string
        ) => {
          set({ isLoading: true, error: null });
          try {
            await api.put("/restaurant/update-password", {
              oldPassword,
              newPassword,
            });

            toast.success("Password updated successfully");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to update password";

            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            return false;
          }
        }, //work successfully

        // Check if Restaurant Data is Completed
        checkRestaurantDataCompleted: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.get("/restaurant/check-restaurant");
            const { completed, restaurant } = response.data;

            if (completed) {
              set({ restaurant });
            }

            return completed;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message ||
              "Failed to check restaurant data";

            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            return false;
          }
        }, //work successfully

        // Complete Restaurant Information
        completeRestaurantInformation: async (
          data: RestaurantData | FormData
        ) => {
          set({ isLoading: true, error: null });
          try {
            const isFormData = data instanceof FormData;
            const config = isFormData
              ? { headers: { "Content-Type": "multipart/form-data" } }
              : undefined;

            const response = await api.post(
              "/restaurant/complete-restaurant",
              data,
              config
            );
            const { restaurant } = response.data;

            set({ restaurant, isLoading: false });
            toast.success("Restaurant created successfully");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message ||
              "Failed to create restaurant";

            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            return false;
          }
        }, //work successfully

        // Update Restaurant Information
        updateRestaurantInformation: async (
          data: RestaurantData | FormData
        ) => {
          set({ isLoading: true, error: null });
          try {
            const isFormData = data instanceof FormData;
            const config = isFormData
              ? { headers: { "Content-Type": "multipart/form-data" } }
              : undefined;

            const response = await api.put(
              "/restaurant/update-restaurant",
              data,
              config
            );
            const { restaurant } = response.data;

            set({ restaurant, isLoading: false });
            toast.success("Restaurant updated successfully");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message ||
              "Failed to update restaurant";

            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            return false;
          }
        },

        // Get All Categories
        getAllCategories: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.get("/restaurant/categories");
            const { categories } = response.data;

            set({ categories, isLoading: false });
            return categories;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message ||
              "Failed to fetch categories";

            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            return [];
          }
        },

        // Create Category
        createCategory: async (data: CategoryData | FormData) => {
          set({ isLoading: true, error: null });
          try {
            const isFormData = data instanceof FormData;
            const config = isFormData
              ? { headers: { "Content-Type": "multipart/form-data" } }
              : undefined;

            const response = await api.post(
              "/restaurant/categories",
              data,
              config
            );
            const { category } = response.data;

            set({
              categories: [...get().categories, category],
              isLoading: false,
            });
            toast.success("Category created successfully");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to create category";

            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            return false;
          }
        },

        // Update Category
        updateCategory: async (
          categoryId: string,
          data: CategoryData | FormData
        ) => {
          set({ isLoading: true, error: null });
          try {
            const isFormData = data instanceof FormData;
            const config = isFormData
              ? { headers: { "Content-Type": "multipart/form-data" } }
              : undefined;

            const response = await api.put(
              `/restaurant/categories/${categoryId}`,
              data,
              config
            );
            const { category } = response.data;

            const updatedCategories = get().categories.map((cat) =>
              cat._id === categoryId ? category : cat
            );

            set({ categories: updatedCategories, isLoading: false });
            toast.success("Category updated successfully");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to update category";

            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            return false;
          }
        },

        // Delete Category
        deleteCategory: async (categoryId: string) => {
          set({ isLoading: true, error: null });
          try {
            await api.delete(`/restaurant/categories/${categoryId}`);

            const updatedCategories = get().categories.filter(
              (cat) => cat._id !== categoryId
            );

            set({ categories: updatedCategories, isLoading: false });
            toast.success("Category deleted successfully");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to delete category";

            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            return false;
          }
        },

        // Clear error
        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: "restaurant-storage", // name of the item in localStorage
        partialize: (state) => ({
          ownerProfile: state.ownerProfile,
          restaurant: state.restaurant,
          categories: state.categories,
        }), // only persist these fields
      }
    )
  )
);

export default useRestaurantStore;
