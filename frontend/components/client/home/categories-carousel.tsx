"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/client/home/section-header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useEffect, useState } from "react";
import useClientStore from "@/store/useClientStore";
import { Button } from "@/components/ui/button";
import { Search, ChevronRight, Clock, Utensils } from "lucide-react";

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
  return (
    <div className="space-y-6 px-4 sm:px-6">
      <SectionHeader title="Categories" viewAllLink="/client/categories" />
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
              className={`pl-4 mx-auto sm:basis-full md:basis-1/2 xl:basis-1/3`}
            >
              <Link
                href={`/client/categories/${category._id}`}
                key={category._id}
                className="group"
              >
                <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-lg group-hover:border-[#ff6900]">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        (process.env.NEXT_PUBLIC_APP_URL || "") +
                          category.image ||
                        "/placeholder.svg?height=300&width=500"
                      }
                      alt={category.nom}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {new Date(category.createdAt).getTime() >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime() ? (
                      <Badge className="absolute top-4 left-4 bg-white/90 text-black hover:bg-white/80">
                        <Clock size={14} className="mr-1" /> New
                      </Badge>
                    ) : null}
                  </div>
                  <CardContent className="p-6 flex flex-col h-[calc(100%-12rem)]">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {category.nom}
                      </h2>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
                      {category.description}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-sm text-muted-foreground">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary group-hover:translate-x-1 transition-transform"
                      >
                        Explore <ChevronRight size={16} />
                      </Button>
                    </div>
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
