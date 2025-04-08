"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAdminStore from "@/store/useAdminStore";

interface CreateRestaurantOwnerProps {
  onSuccess?: () => void;
}

export function CreateRestaurantOwner({
  onSuccess,
}: CreateRestaurantOwnerProps) {
  const { createRestaurantOwner, isLoading } = useAdminStore();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    telephone: "",
    adresse: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await createRestaurantOwner(formData);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nom">Last Name</Label>
          <Input
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prenom">First Name</Label>
          <Input
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            placeholder="First Name"
            required
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
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="motDePasse">Password</Label>
        <Input
          id="motDePasse"
          name="motDePasse"
          type="password"
          value={formData.motDePasse}
          onChange={handleChange}
          placeholder="Password"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telephone">Phone Number</Label>
        <Input
          id="telephone"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="adresse">Address</Label>
        <Input
          id="adresse"
          name="adresse"
          value={formData.adresse}
          onChange={handleChange}
          placeholder="Address"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Restaurant Owner"}
      </Button>
    </form>
  );
}
