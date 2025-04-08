"use client";

import React from "react";
import { useEffect } from "react";

type Props = {};
import useRestaurantStore from "@/store/useRestaurantStore";

export default function RestaurantPage({}: Props) {
  const {
    ownerProfile,
    getOwnerProfile,
    checkRestaurantDataCompleted,
    isLoading,
    error,
  } = useRestaurantStore();

  return <div>here i can see my restaurant page </div>;
}
