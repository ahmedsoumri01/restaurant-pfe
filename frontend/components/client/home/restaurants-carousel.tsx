"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { SectionHeader } from "@/components/client/home/section-header";

// Mock restaurants data
const restaurants = [
  {
    id: "1",
    name: "Burger House",
    image: "/images/restaurants/burger-house.jpg",
    rating: 4.8,
    reviews: 120,
    category: "Fast Food",
    distance: "1.2 km",
    deliveryTime: "15-25 min",
    status: "open",
  },
  {
    id: "2",
    name: "Pizza Palace",
    image: "/images/restaurants/pizza-palace.jpg",
    rating: 4.5,
    reviews: 98,
    category: "Italian",
    distance: "2.5 km",
    deliveryTime: "20-30 min",
    status: "open",
  },
  {
    id: "3",
    name: "Sushi World",
    image: "/images/restaurants/sushi-world.jpg",
    rating: 4.7,
    reviews: 85,
    category: "Japanese",
    distance: "3.1 km",
    deliveryTime: "25-35 min",
    status: "open",
  },
  {
    id: "4",
    name: "Taco Fiesta",
    image: "/images/restaurants/taco-fiesta.jpg",
    rating: 4.3,
    reviews: 65,
    category: "Mexican",
    distance: "1.8 km",
    deliveryTime: "15-25 min",
    status: "closed",
  },
  {
    id: "5",
    name: "Pasta Paradise",
    image: "/images/restaurants/pasta-paradise.jpg",
    rating: 4.6,
    reviews: 110,
    category: "Italian",
    distance: "2.7 km",
    deliveryTime: "20-30 min",
    status: "open",
  },
];

export default function RestaurantsCarousel() {
  return (
    <div>
      <SectionHeader title="Popular Restaurants" viewAllLink="/restaurants" />

      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {restaurants.map((restaurant) => (
            <CarouselItem
              key={restaurant.id}
              className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Link href={`/restaurants/${restaurant.id}`}>
                <Card className="overflow-hidden h-full">
                  <div className="relative">
                    <Badge
                      className={`absolute top-2 left-2 z-10 ${
                        restaurant.status === "open"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {restaurant.status === "open" ? "Open" : "Closed"}
                    </Badge>
                    <div className="h-40 relative">
                      <Image
                        src={`/placeholder.svg?height=160&width=320`}
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <CardContent className="p-3">
                    <h3 className="font-medium">{restaurant.name}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">
                        {restaurant.rating}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        ({restaurant.reviews})
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {restaurant.category}
                    </p>
                  </CardContent>

                  <CardFooter className="p-3 pt-0 flex justify-between items-center text-sm text-gray-500">
                    <span>{restaurant.distance}</span>
                    <span>{restaurant.deliveryTime}</span>
                  </CardFooter>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
