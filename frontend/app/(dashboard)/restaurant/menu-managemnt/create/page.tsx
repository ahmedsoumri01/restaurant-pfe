"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ImagePlus, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import usePlatsStore from "@/store/usePlatsStore";
import useRestaurantStore from "@/store/useRestaurantStore";

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
});

export default function CreatePlatForm() {
  const router = useRouter();
  const { createPlat, isLoading } = usePlatsStore();
  const { categories, getAllCategories } = useRestaurantStore();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log("categories", categories);
  // Initialize form
  const form = useForm<z.infer<typeof platFormSchema>>({
    resolver: zodResolver(platFormSchema),
    defaultValues: {
      nom: "",
      description: "",
      prix: 0,
      categorie: "",
      ingredients: "",
    },
  });
  const fetchCategories = async () => {
    try {
      await getAllCategories();
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      // Create preview URLs for the new files
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));

      // Update state with new files and preview URLs
      setImageFiles((prev) => [...prev, ...newFiles]);
      setImagePreviews((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  // Remove image from preview
  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    // Remove the image and its preview URL from state
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof platFormSchema>) => {
    // Validate that at least one image is uploaded
    if (imageFiles.length === 0) {
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

      // Parse and append ingredients as array
      if (values.ingredients) {
        const ingredientsArray = values.ingredients
          .split(",")
          .map((item) => item.trim());
        ingredientsArray.forEach((ingredient, index) => {
          formData.append(`ingredients[${index}]`, ingredient);
        });
      }

      // Append all images
      imageFiles.forEach((image) => {
        formData.append("images", image);
      });

      // Submit the form data
      const success = await createPlat(formData);

      if (success) {
        toast.success("Plat créé avec succès");
        router.push("restaurant/menu-managemnt");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Une erreur est survenue lors de la création du plat");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Ajouter un nouveau plat</CardTitle>
        <CardDescription>
          Créez un nouveau plat pour votre menu. Ajoutez des images, une
          description et des ingrédients.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plat Name */}
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du plat</FormLabel>
                    <FormControl>
                      <Input placeholder="Couscous Royal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="prix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input type="number" step="0.01" min="0" {...field} />
                        <span className="ml-2">€</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="categorie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ingredients */}
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingrédients</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tomate, Oignon, Poulet..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Séparez les ingrédients par des virgules
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez votre plat, sa préparation, ses saveurs..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <div className="md:col-span-2">
                <FormLabel>Images du plat</FormLabel>
                <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <ImagePlus className="h-12 w-12 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium mb-1">
                      Cliquez pour télécharger des images
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PNG, JPG, JPEG jusqu&apos;à 5MB (minimum 1 image)
                    </span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <FormDescription className="mt-2">
                  Téléchargez des photos de votre plat pour attirer vos clients.
                </FormDescription>

                {/* Image Preview Gallery */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">
                      Aperçu des images ({imagePreviews.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {imagePreviews.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square relative rounded-md overflow-hidden border">
                            <Image
                              src={url || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <CardFooter className="px-0 pt-6 flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting || isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Créer le plat
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
