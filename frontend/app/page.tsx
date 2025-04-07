"use client";

import Image from "next/image";
import login from "@/public/login.jpg";
import logo from "@/public/logo.png";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    nom: z.string().min(1, {
      message: "Nom requis",
    }),
    prenom: z.string().min(1, {
      message: "Prénom requis",
    }),
    email: z.string().email({
      message: "Email invalide",
    }),
    motDePasse: z.string().min(6, {
      message: "Mot de passe requis",
    }),
    telephone: z.string().min(1, {
      message: "Téléphone requis",
    }),
    adresse: z.string().min(1, {
      message: "Adresse requise",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      motDePasse: "",
      telephone: "",
      adresse: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      toast.success("Compte créé avec succès!");
      // Redirect to login or dashboard
      // router.push('/login');
    } catch (error) {
      toast.error("L'inscription a échoué");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-around min-h-screen p-6 px-12">
        <div className="w-3/5">
          <Image
            src={login || "/placeholder.svg"}
            alt="login"
            width={800}
            height={500}
            className="rounded-lg  object-cover"
          />
        </div>
        <div className="w-2/5 ">
          <div className="flex justify-center">
            <Image
              src={logo || "/placeholder.svg"}
              alt="logo"
              width={150}
              height={100}
              className=""
            />
          </div>
          <h1 className="text-2xl font-black text-center mb-6">
            Create an Account
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#777777] font-bold">
                      Nom *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez votre nom"
                        className="h-10 !ring-[#fc953f] "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#777777] font-bold">
                      Prénom *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez votre prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#777777] font-bold">
                      Email *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="exemple@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motDePasse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#777777] font-bold">
                      Mot de passe *
                    </FormLabel>
                    <FormControl>
                      <Input
                        showPasswordToggle={true}
                        type="password"
                        placeholder="******"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#777777] font-bold">
                      Téléphone *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez votre numéro de téléphone"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adresse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#777777] font-bold">
                      Adresse *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez votre adresse" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant={"signUpButton"}
                className={`w-full mt-6 h-12`}
                disabled={isLoading}
              >
                {isLoading ? "Création en cours..." : "Créer un compte"}
              </Button>

              <div className="text-center">
                <p className="text-[#828282]">
                  Vous avez déjà un compte?{" "}
                  <Link
                    href="/login"
                    className="text-[#fc953f] hover:underline"
                  >
                    Connectez-vous
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
