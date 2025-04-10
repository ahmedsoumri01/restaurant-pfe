"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { SectionHeader } from "@/components/client/home/section-header";

// Mock recent orders data
const recentOrders = [
  {
    id: "1",
    name: "Japan Ramen",
    price: 5.59,
    image: "/images/dishes/ramen.jpg",
    distance: "4.97 km",
    time: "21 min",
  },
  {
    id: "2",
    name: "Fried Rice",
    price: 5.59,
    image: "/images/dishes/fried-rice.jpg",
    distance: "4.97 km",
    time: "21 min",
  },
  {
    id: "3",
    name: "Pepperoni Pizza",
    price: 5.59,
    image: "/images/dishes/pepperoni-pizza.jpg",
    distance: "4.97 km",
    time: "21 min",
  },
  {
    id: "4",
    name: "Chicken Biryani",
    price: 5.59,
    image: "/images/dishes/biryani.jpg",
    distance: "4.97 km",
    time: "21 min",
  },
  {
    id: "5",
    name: "Beef Burger",
    price: 5.59,
    image: "/images/dishes/beef-burger.jpg",
    distance: "4.97 km",
    time: "21 min",
  },
];

export default function RecentOrdersCarousel() {
  return (
    <div>
      <SectionHeader title="Recent Order" viewAllLink="/orders" />

      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {recentOrders.map((order) => (
            <CarouselItem
              key={order.id}
              className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Link href={`/orders/${order.id}`}>
                <Card className="overflow-hidden h-full">
                  <div className="relative">
                    <button className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-md">
                      <Heart className="h-5 w-5 text-gray-400" />
                    </button>
                    <div className="aspect-square relative">
                      <Image
                        src={`/placeholder.svg?height=200&width=200`}
                        alt={order.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <CardContent className="p-3 text-center">
                    <h3 className="font-medium">{order.name}</h3>
                    <p className="text-orange-500 font-bold mt-1">
                      ${order.price.toFixed(2)}
                    </p>
                  </CardContent>

                  <CardFooter className="p-3 pt-0 flex justify-center items-center text-sm text-gray-500">
                    <span>{order.distance}</span>
                    <span className="mx-2">•</span>
                    <span>{order.time}</span>
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
