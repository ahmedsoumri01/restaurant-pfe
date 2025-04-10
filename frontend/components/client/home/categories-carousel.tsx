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
import useClientStore from "@/store/useClientStore";

export default function CategoriesGrid() {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  );
  const { getAllCategories, categories } = useClientStore();
  useEffect(() => {
    const fetchData = async () => {
      await getAllCategories();
    };
    fetchData();
  }, [getAllCategories]);
  console.log(categories);
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
              key={category._id}
              className={`pl-4 mx-auto sm:basis-full md:basis-1/2 lg:basis-1/5`}
            >
              <Link href={`/client/categories/${category._id}`}>
                <Card className="border hover:border-orange-500 transition-colors cursor-pointer h-32">
                  <CardContent className="flex flex-col items-center justify-center h-full p-4">
                    <div className="relative w-20 h-20 mb-2">
                      <Image
                        src={
                          `${process.env.NEXT_PUBLIC_APP_URL ?? ""}${
                            category.image
                          }` || "/images/placeholder.png"
                        }
                        alt={category.nom}
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-center font-medium text-sm">
                      {category.nom}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {categories.length != 3 && (
          <CarouselPrevious className="absolute -left-10 sm:left-0 bg-white/80 hover:bg-white" />
        )}
        {categories.length != 3 && (
          <CarouselNext className="absolute -right-10 sm:right-0 bg-white/80 hover:bg-white" />
        )}
      </Carousel>
    </div>
  );
}
