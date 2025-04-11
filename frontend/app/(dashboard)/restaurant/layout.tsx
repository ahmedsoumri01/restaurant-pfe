"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Header from "@/components/header/Header";
import SideBar from "@/components/side-bar/side-bar";
import { restaurantSidebarConfig } from "@/constants/side-bar-data";
import { cn } from "@/lib/utils";

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 700px)");

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsCollapsed(e.matches);
    };

    // Set initial state based on current screen size
    setIsCollapsed(mediaQuery.matches);

    // Add listener for changes
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
      <SideBar config={restaurantSidebarConfig} isCollapsed={isCollapsed} />
      <main
        className={cn(
          "pt-16 transition-all duration-300",
          isCollapsed ? "ml-[70px]" : "ml-[250px]"
        )}
      >
        <div className="h-[calc(100vh-4rem)] overflow-auto lg:p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
