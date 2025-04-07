"use client";
import Link from "next/link";
import { Menu, Search, User, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type HeaderProps = {
  toggleSidebar: () => void;
  isCollapsed: boolean;
};

export default function Header({ toggleSidebar, isCollapsed }: HeaderProps) {
  return (
    <header className="h-16 fixed top-0 left-0 right-0 z-40 bg-orange-500 shadow-md flex items-center px-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center mr-4">
            <span className="text-white font-bold text-xl">FoodDesk</span>
          </Link>

          {/* Toggle sidebar button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-white hover:bg-orange-600"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        <div className="flex-1 max-w-xl mx-4 relative">
          {/* Search bar with orange blur effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-orange-400 opacity-30 blur-md rounded-md"></div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-600" />
              <Input
                type="search"
                placeholder="What do you want eat today"
                className="pl-9 bg-white/90 border-orange-300 focus-visible:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40"
                  alt="User"
                />
                <AvatarFallback className="bg-orange-200 text-orange-800">
                  JD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">Joshua</p>
                <p className="text-sm text-muted-foreground">
                  joshua@example.com
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
