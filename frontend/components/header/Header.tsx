"use client";
import Link from "next/link";
import { Menu, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserDropdown from "@/components/header/UserDropdown";
import Image from "next/image";
import logo from "@/public/logo.png";
import useAuthStore from "@/store/useAuthStore";

type HeaderProps = {
  toggleSidebar: () => void;
  isCollapsed: boolean;
};

export default function Header({ toggleSidebar, isCollapsed }: HeaderProps) {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <header className="h-16 fixed top-0 left-0 right-0 z-40 bg-orange-500 shadow-md flex items-center px-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {/* Logo */}
          <Link href={`/${user?.role}`} className="flex items-center">
            <Image
              src={logo}
              alt="Logo"
              width={70}
              height={70}
              className="h-16 w-16 rounded-full mr-2"
            />
            <span className="hidden text-white text-lg font-bold md:block">
              YUMMY FLY
            </span>
          </Link>

          {/* Toggle sidebar button */}
          <Button
            size="icon"
            onClick={toggleSidebar}
            className="text-white hover:bg-orange-600 cursor-pointer bg-transparent"
          >
            <Menu size={24} />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <div></div>
        </div>

        <div className="flex-1 w-full max-w-[700px] mx-4 relative">
          {/* Search bar with orange blur effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-orange-400 opacity-30 blur-md rounded-md"></div>
            <div className="relative">
              <Search
                color="white"
                width={20}
                height={20}
                size={24}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4   text-orange-600"
              />
              <Input
                type="search"
                placeholder="What do you want eat today"
                className="pl-9 bg-white/60 border-orange-300 h-12  focus-visible:ring-orange-500 "
              />
            </div>
          </div>
        </div>

        {/* User dropdown */}
        <UserDropdown />
      </div>
    </header>
  );
}
