"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { SectionHeader } from "@/components/client/home/section-header";

// Mock categories data
const categories = [
  {
    id: "1",
    name: "Beverage",
    icon: "https://www.southernliving.com/thmb/bCrxpdhq9KTcDsqrjEdqbnV0_V0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/27793_SnacT_FireQuesadillas_209-1-9423bf482c1f464581040613234d2f27.jpg",
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

export default function CategoriesCarousel() {
  return (
    <div>
      <SectionHeader title="Category" viewAllLink="/categories" />

      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <Link href={`/categories/${category.id}`}>
                <Card className="border hover:border-orange-500 transition-colors cursor-pointer h-32">
                  <CardContent className="flex flex-col items-center justify-center h-full p-4">
                    <div className="relative w-16 h-16 mb-2">
                      <Image
                        src={`https://www.southernliving.com/thmb/bCrxpdhq9KTcDsqrjEdqbnV0_V0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/27793_SnacT_FireQuesadillas_209-1-9423bf482c1f464581040613234d2f27.jpg`}
                        alt={category.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-center font-medium">
                      {category.name}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
