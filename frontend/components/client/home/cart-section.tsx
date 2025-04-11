"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Plus, Minus } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/useCartStore";
import useClientStore from "@/store/useClientStore";
/* import type { CartItem } from "@/stores/use-cart-store" */

export default function CartSection() {
  const {
    items,
    updateQuantity,
    clearCart,
    getTotal,
    getServiceFee,
    getGrandTotal,
  } = useCartStore();
  const [address, setAddress] = useState("Elm Street, 23");

  const handleQuantityChange = (item: any, newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };
  const handleCheckout = () => {
    alert(JSON.stringify(items, null, 2));
  };
  const handleClearCart = () => {
    clearCart();
  };
  return (
    <Card className="w-[420px] bg-[#fff2e7] border-[#fc8019] ">
      <CardHeader className="pb-3">
        <CardTitle className="text-[#fc8019] font-bold text-2xl">
          Your Cart
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Address Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-[#fc8019]">Your Address</h3>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-orange-500 border-orange-500 bg-transparent cursor-pointer hover:bg-orange-500 hover:text-white transition-colors"
            >
              Change
            </Button>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <p className="font-bold">{address}</p>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod
                tempor incididunt.
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-10 bg-[#fc8019] text-white font-bold cursor-pointer"
            >
              Add Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-10 bg-[#fc8019] text-white font-bold cursor-pointer"
            >
              Add Note
            </Button>
          </div>
        </div>

        <Separator />

        {/* Cart Items */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button
                asChild
                variant="default"
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Link href="/">Browse Menu</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 relative rounded-md overflow-hidden border">
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_APP_URL + item.image ||
                      `/placeholder.svg?height=64&width=64`
                    }
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.price} DT</p>
                  <p className="text-sm text-gray-500">x{item.quantity}</p>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-orange-500 font-bold">
                    +{(item.price * item.quantity).toFixed(2)} DT
                  </span>

                  <div className="flex items-center mt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-md border-gray-300"
                      onClick={() =>
                        handleQuantityChange(item, item.quantity - 1)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item,
                          Number.parseInt(e.target.value) || 1
                        )
                      }
                      className="h-7 w-16 px-1 mx-0.5 text-center"
                    />

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-md border-gray-300"
                      onClick={() =>
                        handleQuantityChange(item, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <>
            <Separator />

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Service</span>
                <span>+{getServiceFee().toFixed(2)} DT</span>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-orange-500">
                  +{getGrandTotal().toFixed(2)} DT
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>

      {items.length > 0 && (
        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg"
            onClick={handleCheckout}
          >
            Checkout
          </Button>
          <Button
            onClick={handleClearCart}
            className="h-8 text-orange-500 border-orange-500 bg-transparent cursor-pointer hover:border-orange-500 hover:text-white transition-colors"
          >
            Clear Cart
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
