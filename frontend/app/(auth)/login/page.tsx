"use client";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/public/logo.png";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      // Here you would typically make an API call to authenticate the user
      // For example:
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values),
      // });
      //
      // if (!response.ok) throw new Error('Login failed');

      toast.success("Login successful!");
      // Redirect to dashboard
      // router.push('/dashboard');
    } catch (error) {
      toast.error("Login failed");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5EB]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">
        <div className="flex justify-center">
          <Image
            src={logo || "/placeholder.svg"}
            alt="logo"
            width={150}
            height={100}
            className=""
          />
        </div>

        <h1 className="text-xl font-bold text-[#3d4152] text-center mb-6">
          Sign in to your account
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#777777] font-bold">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="hello@example.com"
                      className="h-12 rounded-md border-gray-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#777777] font-bold">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-12 rounded-md border-gray-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 bg-[#FF8A2B] hover:bg-[#E67A1B] text-white rounded-md font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-gray-500 text-sm">
                Don't have an account?{" "}
                <Link href="/" className="text-[#FF8A2B] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
