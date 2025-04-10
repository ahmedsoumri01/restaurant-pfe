"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import usePlatsStore from "@/store/usePlatsStore";
import useRestaurantStore from "@/store/useRestaurantStore";

import { GeneralInfoTab } from "./general-info-tab";
import { ImagesTab } from "./images-tab";
import { VideosTab } from "./videos-tab";

// Form validation schema
const platFormSchema = z.object({
  nom: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères",
  }),
  prix: z.coerce
    .number({ invalid_type_error: "Le prix doit être un nombre" })
    .positive({ message: "Le prix doit être positif" }),
  categorie: z.string({
    required_error: "Veuillez sélectionner une catégorie",
  }),
  ingredients: z.string().optional(),
  disponible: z.boolean().default(true).optional(),
});

export type PlatFormValues = z.infer<typeof platFormSchema>;

interface UpdatePlatModalProps {
  platId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UpdatePlatModal({
  platId,
  isOpen,
  onClose,
  onSuccess,
}: UpdatePlatModalProps) {
  const { currentPlat, getPlatById, updatePlat, isLoading } = usePlatsStore();
  const { categories, getAllCategories } = useRestaurantStore();

  const [activeTab, setActiveTab] = useState("general");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingVideos, setExistingVideos] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<PlatFormValues>({
    resolver: zodResolver(platFormSchema),
    defaultValues: {
      nom: "",
      description: "",
      prix: 0,
      categorie: "",
      ingredients: "",
      disponible: true,
    },
  });

  // Fetch plat data and categories when modal opens
  useEffect(() => {
    if (isOpen && platId) {
      const fetchData = async () => {
        await getAllCategories();
        const plat = await getPlatById(platId);
        if (plat) {
          // Reset existing media arrays
          setExistingImages(plat.images || []);
          setExistingVideos(plat.videos || []);

          // Reset form values
          form.reset({
            nom: plat.nom,
            description: plat.description,
            prix: plat.prix,
            categorie:
              typeof plat.categorie === "string"
                ? plat.categorie
                : plat.categorie._id,
            ingredients: plat.ingredients.join(", "),
            disponible: plat.disponible,
          });
        }
      };
      fetchData();
    }
  }, [isOpen, platId, getPlatById, getAllCategories, form]);

  // Handle form submission
  const onSubmit = async (values: PlatFormValues) => {
    // Validate that at least one image is present (either existing or new)
    if (existingImages.length === 0 && imageFiles.length === 0) {
      toast.error("Veuillez télécharger au moins une image");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData object for submission
      const formData = new FormData();
      formData.append("nom", values.nom);
      formData.append("description", values.description);
      formData.append("prix", values.prix.toString());
      formData.append("categorie", values.categorie);
      formData.append("disponible", (values.disponible ?? true).toString());

      // Parse and append ingredients as array
      if (values.ingredients) {
        const ingredientsArray = values.ingredients
          .split(",")
          .map((item) => item.trim());
        ingredientsArray.forEach((ingredient, index) => {
          formData.append(`ingredients[${index}]`, ingredient);
        });
      }

      // Append existing images to keep
      existingImages.forEach((image, index) => {
        formData.append(`existingImages[${index}]`, image);
      });

      // Append existing videos to keep
      existingVideos.forEach((video, index) => {
        formData.append(`existingVideos[${index}]`, video);
      });

      // Append all new images
      imageFiles.forEach((image) => {
        formData.append("newImages", image);
      });

      // Append all new videos
      videoFiles.forEach((video) => {
        formData.append("newVideos", video);
      });

      // Submit the form data
      const success = await updatePlat(platId, formData);

      if (success) {
        toast.success("Plat mis à jour avec succès");
        onClose();
        if (onSuccess) onSuccess();

        // Clean up object URLs
        imagePreviews.forEach(URL.revokeObjectURL);
        videoPreviews.forEach(URL.revokeObjectURL);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Une erreur est survenue lors de la mise à jour du plat");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset state when modal closes
  const handleClose = () => {
    // Clean up object URLs
    imagePreviews.forEach(URL.revokeObjectURL);
    videoPreviews.forEach(URL.revokeObjectURL);

    // Reset state
    setImageFiles([]);
    setVideoFiles([]);
    setImagePreviews([]);
    setVideoPreviews([]);
    setActiveTab("general");

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le plat</DialogTitle>
          <DialogDescription>
            Modifiez les informations, les images et les vidéos de votre plat.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general">Informations générales</TabsTrigger>
            <TabsTrigger value="images">
              Images ({existingImages.length + imageFiles.length})
            </TabsTrigger>
            <TabsTrigger value="videos">
              Vidéos ({existingVideos.length + videoFiles.length})
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value="general">
                <GeneralInfoTab form={form} categories={categories} />
              </TabsContent>

              <TabsContent value="images">
                <ImagesTab
                  existingImages={existingImages}
                  setExistingImages={setExistingImages}
                  imageFiles={imageFiles}
                  setImageFiles={setImageFiles}
                  imagePreviews={imagePreviews}
                  setImagePreviews={setImagePreviews}
                />
              </TabsContent>

              <TabsContent value="videos">
                <VideosTab
                  existingVideos={existingVideos}
                  setExistingVideos={setExistingVideos}
                  videoFiles={videoFiles}
                  setVideoFiles={setVideoFiles}
                  videoPreviews={videoPreviews}
                  setVideoPreviews={setVideoPreviews}
                />
              </TabsContent>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting || isLoading}>
                  {isSubmitting || isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mise à jour en cours...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer les modifications
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
