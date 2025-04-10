"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/client/home/section-header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useEffect, useState } from "react";

// Mock categories data
const categories = [
  {
    id: "1",
    name: "Beverage",
    icon: "/images/categories/beverage.png",
  },
  {
    id: "2",
    name: "Chicken",
    icon: "/images/categories/chicken.png",
  },
  {
    id: "3",
    name: "Pizza",
    icon: "/images/categories/pizza.png",
  },
  {
    id: "4",
    name: "Burger",
    icon: "/images/categories/burger.png",
  },
  {
    id: "5",
    name: "Pasta",
    icon: "/images/categories/pasta.png",
  },
  {
    id: "6",
    name: "Dessert",
    icon: "/images/categories/dessert.png",
  },
  {
    id: "7",
    name: "Salad",
    icon: "/images/categories/salad.png",
  },
  {
    id: "8",
    name: "Soup",
    icon: "/images/categories/soup.png",
  },
  {
    id: "9",
    name: "Seafood",
    icon: "/images/categories/seafood.png",
  },
  {
    id: "10",
    name: "Breakfast",
    icon: "/images/categories/breakfast.png",
  },
];

export default function CategoriesGrid() {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  return (
    <div className="space-y-6 px-4 sm:px-6">
      <SectionHeader title="Category" viewAllLink="/client/categories" />
      <Carousel
        plugins={[autoplayPlugin.current]}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: 1,
        }}
      >
        <CarouselContent className="-ml-4">
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className={`pl-4   sm:basis-full md:basis-1/2 lg:basis-1/3`}
            >
              <Link href={`/categories/${category.id}`}>
                <Card className="border hover:border-orange-500 transition-colors cursor-pointer h-28">
                  <CardContent className="flex flex-col items-center justify-center h-full p-4">
                    <div className="relative w-12 h-12 mb-2">
                      <Image
                        src={category.icon}
                        alt={category.name}
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-center font-medium text-sm">
                      {category.name}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-3 sm:left-0 bg-white/80 hover:bg-white" />
        <CarouselNext className="absolute -right-3 sm:right-0 bg-white/80 hover:bg-white" />
      </Carousel>
    </div>
  );
}
