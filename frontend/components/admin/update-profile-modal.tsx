"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useAdminStore from "@/store/useAdminStore";
import { Pencil } from "lucide-react";

interface User {
  _id: string;
  nom?: string;
  prenom?: string;
  email: string;
  telephone?: string;
  adresse?: string;
  photoProfil?: string;
}

interface UpdateProfileModalProps {
  user: User;
  onProfileUpdated: () => void;
}

export function UpdateProfileModal({
  user,
  onProfileUpdated,
}: UpdateProfileModalProps) {
  const { updateAdminProfile, isLoading } = useAdminStore();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    nom: user.nom || "",
    prenom: user.prenom || "",
    email: user.email || "",
    telephone: user.telephone || "",
    adresse: user.adresse || "",
    photoProfil: user.photoProfil || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await updateAdminProfile(formData);
    if (success) {
      setOpen(false);
      onProfileUpdated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          Modifier mon profil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier mon profil</DialogTitle>
          <DialogDescription>
            Mettez à jour vos informations personnelles.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Nom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Prénom"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="Téléphone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                placeholder="Adresse"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoProfil">URL de la photo de profil</Label>
              <Input
                id="photoProfil"
                name="photoProfil"
                value={formData.photoProfil}
                onChange={handleChange}
                placeholder="URL de la photo de profil"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Mise à jour..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
