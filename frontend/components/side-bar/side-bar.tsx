"use client";

import type React from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Store,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { adminSidebarConfig } from "@/constants/side-bar-data";
// Define types for our sidebar items
export type SidebarItemType = {
  title: string;
  path: string;
  icon: React.ElementType;
  submenu?: SidebarItemType[];
};

export type SidebarConfig = {
  mainMenu: SidebarItemType[];
  otherMenu?: SidebarItemType[];
};

type SideBarProps = {
  config?: SidebarConfig;
  isCollapsed: boolean;
};

export default function SideBar({
  config = adminSidebarConfig,
  isCollapsed,
}: SideBarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 fixed top-16 left-0 z-30",
        isCollapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Main Menu Section */}
        {config.mainMenu.length > 0 && (
          <div className="py-4">
            {!isCollapsed && (
              <div className="px-4 mb-2 text-sm font-medium text-gray-500">
                Main Menu
              </div>
            )}
            <div className="space-y-1">
              {config.mainMenu.map((item, index) => (
                <SidebarItem
                  key={index}
                  item={item}
                  isActive={
                    pathname === item.path ||
                    pathname.startsWith(item.path + "/")
                  }
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Menu Section */}
        {config.otherMenu && config.otherMenu.length > 0 && (
          <div className="py-4 border-t">
            {!isCollapsed && (
              <div className="px-4 mb-2 text-sm font-medium text-gray-500">
                Other
              </div>
            )}
            <div className="space-y-1">
              {config.otherMenu.map((item, index) => (
                <SidebarItem
                  key={index}
                  item={item}
                  isActive={
                    pathname === item.path ||
                    pathname.startsWith(item.path + "/")
                  }
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

type SidebarItemProps = {
  item: SidebarItemType;
  isActive: boolean;
  isCollapsed: boolean;
};

function SidebarItem({ item, isActive, isCollapsed }: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(isActive);
  const Icon = item.icon;

  // If item has submenu, render as collapsible
  if (item.submenu && item.submenu.length > 0) {
    return (
      <Collapsible
        open={isOpen && !isCollapsed}
        onOpenChange={isCollapsed ? undefined : setIsOpen}
        className="w-full"
      >
        <div className="flex items-center">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex items-center justify-center h-10 w-full cursor-pointer",
                      isActive
                        ? "text-orange-500"
                        : "text-gray-700 hover:text-orange-500"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <CollapsibleTrigger className="flex items-center w-full px-4 py-2 text-left">
              <div
                className={cn(
                  "flex items-center w-full",
                  isActive
                    ? "text-orange-500"
                    : "text-gray-700 hover:text-orange-500"
                )}
              >
                <Icon className="h-5 w-5 mr-2" />
                <span className="flex-1">{item.title}</span>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </CollapsibleTrigger>
          )}
        </div>

        {!isCollapsed && (
          <CollapsibleContent>
            <div className="pl-9 space-y-1 mt-1">
              {item.submenu.map((subItem, index) => (
                <Link
                  key={index}
                  href={subItem.path}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm rounded-md"
                    /*   pathname === subItem.path
                      ? "bg-orange-50 text-orange-500"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-500" */
                  )}
                >
                  <subItem.icon className="h-4 w-4 mr-2" />
                  <span>{subItem.title}</span>
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    );
  }

  // Simple menu item without submenu
  return (
    <>
      {isCollapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={item.path}
                className={cn(
                  "flex items-center justify-center h-10 w-full",
                  isActive
                    ? "text-orange-500"
                    : "text-gray-700 hover:text-orange-500"
                )}
              >
                <Icon className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Link
          href={item.path}
          className={cn(
            "flex items-center px-4 py-2",
            isActive
              ? "bg-orange-50 text-orange-500"
              : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
          )}
        >
          <Icon className="h-5 w-5 mr-2" />
          <span>{item.title}</span>
        </Link>
      )}
    </>
  );
}
