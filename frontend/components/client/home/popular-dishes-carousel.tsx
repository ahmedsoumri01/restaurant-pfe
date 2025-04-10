"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/use-cart-store";
import useClientStore from "@/store/useClientStore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { SectionHeader } from "@/components/client/home/section-header";
import DishCard from "@/components/client/home/dish-card";
import { Skeleton } from "@/components/ui/skeleton";

// Mock popular dishes data (in case API fails)
const mockPopularDishes = [
  {
    _id: "1",
    nom: "Panner Burger",
    description: "Delicious vegetarian burger with paneer cheese",
    prix: 5.59,
    images: ["/images/dishes/panner-burger.jpg"],
    ingredients: ["Paneer", "Lettuce", "Tomato", "Sauce"],
    categorie: { _id: "4", nom: "Burger" },
    restaurant: { _id: "1", nom: "Burger House" },
    disponible: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    discount: "15% Off",
  },
  {
    _id: "2",
    nom: "Tandoori Burger",
    description: "Spicy tandoori chicken burger with special sauce",
    prix: 5.59,
    images: ["/images/dishes/tandoori-burger.jpg"],
    ingredients: ["Chicken", "Tandoori Spices", "Lettuce", "Sauce"],
    categorie: { _id: "4", nom: "Burger" },
    restaurant: { _id: "1", nom: "Burger House" },
    disponible: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    discount: "Exclusive",
  },
  {
    _id: "3",
    nom: "Cheese Burger",
    description: "Classic cheeseburger with premium beef patty",
    prix: 5.59,
    images: ["/images/dishes/cheese-burger.jpg"],
    ingredients: ["Beef", "Cheese", "Lettuce", "Tomato"],
    categorie: { _id: "4", nom: "Burger" },
    restaurant: { _id: "1", nom: "Burger House" },
    disponible: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    discount: "15% Off",
  },
  {
    _id: "4",
    nom: "Veggie Burger",
    description: "Healthy vegetable burger with fresh ingredients",
    prix: 5.59,
    images: ["/images/dishes/veggie-burger.jpg"],
    ingredients: ["Vegetables", "Lettuce", "Tomato", "Sauce"],
    categorie: { _id: "4", nom: "Burger" },
    restaurant: { _id: "1", nom: "Burger House" },
    disponible: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    discount: "10% Off",
  },
];

interface PopularDishesCarouselProps {
  isLoading: boolean;
}

export default function PopularDishesCarousel({
  isLoading,
}: PopularDishesCarouselProps) {
  const { plats } = useClientStore();
  const { addItem } = useCartStore();
  const [popularDishes, setPopularDishes] = useState(mockPopularDishes);

  useEffect(() => {
    // If we have real dishes from the API, use them
    if (plats.length > 0) {
      // Add mock discounts to the real dishes
      const discounts = ["15% Off", "Exclusive", "10% Off", "New", ""];
      const enhancedPlats = plats.slice(0, 10).map((plat, index) => ({
        ...plat,
        discount: discounts[index % discounts.length],
      }));
      setPopularDishes(enhancedPlats);
    }
  }, [plats]);

  const handleAddToCart = (dish: any) => {
    addItem({
      id: dish._id,
      name: dish.nom,
      price: dish.prix,
      quantity: 1,
      image: dish.images[0],
    });
  };

  if (isLoading) {
    return (
      <div>
        <SectionHeader title="Popular Dishes" viewAllLink="/dishes" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-40 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="Popular Dishes" viewAllLink="/dishes" />

      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {popularDishes.map((dish) => (
            <CarouselItem
              key={dish._id}
              className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <DishCard dish={dish} onAddToCart={() => handleAddToCart(dish)} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
