"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/use-cart-store";
import useClientStore from "@/store/useClientStore";
import PromotionCarousel from "@/components/client/home/promotion-carousel";
import CategoriesCarousel from "@/components/client/home/categories-carousel";
import PopularDishesCarousel from "@/components/client/home/popular-dishes-carousel";
import RecentOrdersCarousel from "@/components/client/home/recent-orders-carousel";
import RestaurantsCarousel from "@/components/client/home/restaurants-carousel";
import CartSection from "@/components/client/home/cart-section";

export default function AccueilPage() {
  const { getAllDisponiblePlats, isLoading } = useClientStore();
  const { initializeCart } = useCartStore();

  useEffect(() => {
    // Initialize cart from localStorage if available
    initializeCart();

    // Fetch available dishes
    const fetchData = async () => {
      await getAllDisponiblePlats();
    };

    fetchData();
  }, [getAllDisponiblePlats, initializeCart]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6 max-w-[1400px] mx-auto">
      {/* Main Content */}
      <div className="flex-1">
        {/* Promotions Carousel */}
        <section className="mb-8">
          <PromotionCarousel />
        </section>

        {/* Categories Carousel */}
        <section className="mb-8">
          <CategoriesCarousel />
        </section>

        {/* Popular Dishes Carousel */}
        <section className="mb-8">
          <PopularDishesCarousel isLoading={isLoading} />
        </section>

        {/* Recent Orders Carousel */}
        <section className="mb-8">
          <RecentOrdersCarousel />
        </section>

        {/* Restaurants Carousel */}
        <section className="mb-8">
          <RestaurantsCarousel />
        </section>
      </div>

      {/* Cart Section */}
      <div className="w-full md:w-[380px] sticky top-4 h-fit">
        <CartSection />
      </div>
    </div>
  );
}
