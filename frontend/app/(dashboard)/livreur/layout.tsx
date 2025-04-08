"use client";

import type React from "react";

import { useState } from "react";
import Header from "@/components/header/Header";
import SideBar from "@/components/side-bar/side-bar";
import { cn } from "@/lib/utils";
import { livreurSidebarConfig } from "@/constants/side-bar-data";
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
      <SideBar config={livreurSidebarConfig} isCollapsed={isCollapsed} />
      <main
        className={cn(
          "pt-16 transition-all duration-300",
          isCollapsed ? "ml-[70px]" : "ml-[250px]"
        )}
      >
        <div className="p-6 h-[calc(100vh-4rem)] overflow-auto">{children}</div>
      </main>
    </div>
  );
}
