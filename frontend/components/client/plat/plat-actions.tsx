"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import useAuthStore from "@/store/useAuthStore";
import { useCartStore, type CartItem } from "@/store/useCartStore";

interface PlatActionsProps {
  plat: any;
  onLike: () => Promise<void>;
  isLiking: boolean;
}

export default function PlatActions({
  plat,
  onLike,
  isLiking,
}: PlatActionsProps) {
  const { user } = useAuthStore((state) => state);
  const { addItem, updateQuantity, items } = useCartStore();
  const [isLiked, setIsLiked] = useState(
    plat.likes?.includes(user?._id) || false
  );
  const [quantity, setQuantity] = useState(1);

  // Check if item is already in cart
  const existingCartItem = items.find((item) => item.id === plat._id);
  const existingQuantity = existingCartItem?.quantity || 0;

  const handleLike = async () => {
    setIsLiked(!isLiked);
    await onLike();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: plat.nom,
          text: plat.description,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: plat._id,
      name: plat.nom,
      price: plat.prix,
      quantity: quantity,
      image: plat.images[0] || "/placeholder.svg?height=100&width=100",
    };

    if (existingCartItem) {
      // Update quantity if already in cart
      updateQuantity(plat._id, existingQuantity + quantity);
      toast.success(
        `Updated ${plat.nom} quantity in cart (${existingQuantity + quantity})`
      );
    } else {
      // Add new item to cart
      addItem(cartItem);
      toast.success(`Added ${quantity} ${plat.nom} to cart`);
    }

    // Reset quantity selector after adding to cart
    setQuantity(1);
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center gap-2">
        <div className="flex border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <div className="flex items-center justify-center w-12">
            {quantity}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </Button>
        </div>

        <Button
          className="flex-1 gap-2 bg-primary hover:bg-primary/90"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          {existingCartItem ? "Update Cart" : "Add to Cart"}
        </Button>
      </div>

      {existingCartItem && (
        <div className="text-sm text-gray-500">
          Already in cart: {existingQuantity}{" "}
          {existingQuantity > 1 ? "items" : "item"}
        </div>
      )}

      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={isLiked ? "text-red-500" : ""}
                onClick={handleLike}
                disabled={isLiking}
              >
                <Heart className={isLiked ? "fill-red-500" : ""} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isLiked ? "Unlike" : "Like"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
