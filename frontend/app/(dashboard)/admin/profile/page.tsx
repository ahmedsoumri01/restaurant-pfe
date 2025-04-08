"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAdminStore from "@/store/useAdminStore";
import { toast } from "sonner";

export default function AdminProfile() {
  const { adminProfile, getAdminProfile, updateAdminProfile, isLoading } =
    useAdminStore();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    photoProfil: "",
  });

  useEffect(() => {
    getAdminProfile();
  }, [getAdminProfile]);

  useEffect(() => {
    if (adminProfile) {
      setFormData({
        nom: adminProfile.nom || "",
        prenom: adminProfile.prenom || "",
        email: adminProfile.email || "",
        telephone: adminProfile.telephone || "",
        adresse: adminProfile.adresse || "",
        photoProfil: adminProfile.photoProfil || "",
      });
    }
  }, [adminProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await updateAdminProfile(formData);
    if (success) {
      toast.success("Profile updated successfully");
    }
  };

  const getInitials = () => {
    if (!adminProfile) return "AD";
    return `${adminProfile.nom?.charAt(0) || ""}${
      adminProfile.prenom?.charAt(0) || ""
    }`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={adminProfile?.photoProfil || ""} alt="Admin" />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <CardTitle>Admin Profile</CardTitle>
      </CardHeader>
      <CardContent>
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
            <Label htmlFor="telephone">Phone Number</Label>
            <Input
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="Phone Number"
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoProfil">Profile Photo URL</Label>
            <Input
              id="photoProfil"
              name="photoProfil"
              value={formData.photoProfil}
              onChange={handleChange}
              placeholder="Profile Photo URL"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
