import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Store,
  Bike,
  AppWindow,
  BarChart3,
  LifeBuoy,
  Puzzle,
  Settings,
  FileText,
  Truck,
  TableIcon,
  Command,
  Files,
  Users,
} from "lucide-react";
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
export const adminSidebarConfig: SidebarConfig = {
  mainMenu: [
    {
      title: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Gérer tous les utilisateurs",
      path: "/admin/user-management",
      icon: Users,
      submenu: [
        {
          title: "All utilisateurs",
          path: "/admin/user-management",
          icon: Users,
        },
      ],
    },
    {
      title: "Gérer tous les Restaurant",
      path: "/admin/users",
      icon: Store,
      submenu: [
        {
          title: "All Restaurants",
          path: "/admin/restaurant/all",
          icon: Store,
        },
        /*  {
          title: "Add Restaurant",
          path: "/admin/restaurant/add",
          icon: Store,
        }, */
      ],
    },
    {
      title: "Gérer tous les commandes",
      path: "/admin/users",
      icon: Command,
      submenu: [
        {
          title: "All commandes",
          path: "/admin/commande/all",
          icon: Command,
        },
      ],
    },
    {
      title: "Gérer tous les livraisons",
      path: "/admin/delivery",
      icon: Truck,
      submenu: [
        {
          title: "All livraisons",
          path: "/admin/delivery/all",
          icon: Truck,
        },
      ],
    },
  ],
  /*   otherMenu: [
      {
        title: "Apps",
        path: "/admin/apps",
        icon: AppWindow,
      },
      {
        title: "Charts",
        path: "/admin/charts",
        icon: BarChart3,
      },
      {
        title: "Bootstrap",
        path: "/admin/bootstrap",
        icon: LifeBuoy,
      },
      {
        title: "Plugins",
        path: "/admin/plugins",
        icon: Puzzle,
        submenu: [
          {
            title: "Plugin 1",
            path: "/admin/plugins/1",
            icon: Puzzle,
          },
          {
            title: "Plugin 2",
            path: "/admin/plugins/2",
            icon: Puzzle,
          },
        ],
      },
      {
        title: "Widget",
        path: "/admin/widget",
        icon: Settings,
      },
      {
        title: "Forms",
        path: "/admin/forms",
        icon: FileText,
      },
      {
        title: "Table",
        path: "/admin/table",
        icon: TableIcon,
      },
      {
        title: "Pages",
        path: "/admin/pages",
        icon: Files,
      },
    ], */
};

export const clientSidebarConfig: SidebarConfig = {
  mainMenu: [
    {
      title: "Dashboard",
      path: "/client",
      icon: LayoutDashboard,
    },
    {
      title: "Orders",
      path: "/client/orders",
      icon: FileText,
    },
    {
      title: "Favorites",
      path: "/client/favorites",
      icon: Store,
    },
  ],
};

export const restaurantSidebarConfig: SidebarConfig = {
  mainMenu: [
    {
      title: "Dashboard",
      path: "/restaurant",
      icon: LayoutDashboard,
    },
    {
      title: "mon restaurant",
      path: "/restaurant/restaurant-managemnt",
      icon: Store,
      submenu: [
        {
          title: "restaurant profile",
          path: "/restaurant/restaurant-managemnt",
          icon: FileText,
        },
        {
          title: "update my restaurant",
          path: "/restaurant/restaurant-managemnt/update-restaurant",
          icon: FileText,
        },
      ],
    },
    {
      title: "Gestion du menu",
      path: "/restaurant/menu",
      icon: FileText,
      submenu: [
        {
          title: "All plat",
          path: "/restaurant/menu/all",
          icon: FileText,
        },
        {
          title: "All categories",
          path: "/restaurant/menu/all",
          icon: FileText,
        },
        {
          title: "Add Item",
          path: "/restaurant/menu/add",
          icon: FileText,
        },
      ],
    },
    {
      title: "Orders",
      path: "/restaurant/orders",
      icon: Store,
    },
  ],
};

//livreurSideBarConfig
export const livreurSidebarConfig: SidebarConfig = {
  mainMenu: [
    {
      title: "Dashboard",
      path: "/livreur",
      icon: LayoutDashboard,
    },
    {
      title: "Gestion du menu",
      path: "/livreur/menu",
      icon: FileText,
      submenu: [
        {
          title: "All plat",
          path: "/livreur/menu/all",
          icon: FileText,
        },
        {
          title: "All categories",
          path: "/livreur/menu/all",
          icon: FileText,
        },
        {
          title: "Add Item",
          path: "/livreur/menu/add",
          icon: FileText,
        },
      ],
    },
    {
      title: "Orders",
      path: "/livreur/orders",
      icon: Store,
    },
  ],
};
