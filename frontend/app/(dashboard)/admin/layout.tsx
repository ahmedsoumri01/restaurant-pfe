"use client";

import type React from "react";
import Header from "@/components/Header";
import SideBar from "@/components/side-bar/side-bar";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex h-full w-full">
        <SideBar />
        <div className="flex-1 overflow-auto p-2 bg-red-500">{children}</div>
      </div>
    </>
  );
}
