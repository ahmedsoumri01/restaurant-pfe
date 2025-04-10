"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/client/home/star-rating";

interface DishCardProps {
  dish: any;
  onAddToCart: () => void;
}

export default function DishCard({ dish, onAddToCart }: DishCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card className="overflow-hidden h-full">
      <Link href={`/dishes/${dish._id}`}>
        <div className="relative">
          {dish.discount && (
            <Badge className="absolute top-2 left-2 z-10 bg-red-500">
              {dish.discount}
            </Badge>
          )}
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-md"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
          <div className="h-40 relative">
            <Image
              src={dish.images[0] || `/placeholder.svg?height=160&width=320`}
              alt={dish.nom}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </Link>

      <CardContent className="p-3">
        <StarRating rating={3} />
        <h3 className="font-medium mt-1 line-clamp-1">{dish.nom}</h3>
        <p className="text-sm text-gray-500 line-clamp-1">
          {typeof dish.categorie === "string"
            ? dish.categorie
            : dish.categorie.nom}
        </p>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex justify-between items-center">
        <div className="text-orange-500 font-bold">${dish.prix.toFixed(2)}</div>
        <Button
          size="icon"
          className="h-8 w-8 rounded-md bg-orange-500 hover:bg-orange-600"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart();
          }}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
