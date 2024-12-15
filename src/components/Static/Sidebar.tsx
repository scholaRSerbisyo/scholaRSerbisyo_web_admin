"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import { BadgeCheck, Bell, Calendar, ChevronRight, ChevronDown, ChevronsUpDown, CreditCard, LayoutDashboardIcon, GalleryVerticalEnd, LogOut, Settings2, Sparkles, User, UserRoundCheck, Settings } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import NavbarComponent from "./Navbar";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/auth/auth";
import { Button } from "../ui/button";
import { FAQDialog } from "../FAQs/FAQDialog";

interface NavSubItem {
  title: string;
  path: string;
}

interface BaseNavItem {
  title: string;
  icon: React.ComponentType<any>;
}

interface NavItemWithPath extends BaseNavItem {
  path: string;
  items?: never;
}

interface NavItemWithSubItems extends BaseNavItem {
  path?: never;
  items: NavSubItem[];
}

type NavItem = NavItemWithPath | NavItemWithSubItems;

interface SidebarComponentProps {
  children: React.ReactNode;
  email: string;
  name: string;
  admintype: number;
}

export default function SidebarComponent({
  children,
  email,
  name,
  admintype,
}: SidebarComponentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        title: "Dashboard",
        icon: LayoutDashboardIcon,
        path: "/dashboard",
      },
    ];

    const returnServiceItem: NavItem = {
      title: "Return Services Status",
      icon: UserRoundCheck,
      path: "/rsstatus",
    };

    // Admin type 1 gets all items
    if (admintype === 1) {
      return [
        ...baseItems,
        {
          title: "Events",
          icon: Calendar,
          items: [
            { title: "CSO", path: "/events/cso" },
            { title: "School", path: "/events/school" },
            { title: "Community", path: "/events/community" },
          ],
        },
        returnServiceItem,
      ];
    }

    // Admin type 2 gets CSO events
    if (admintype === 2) {
      return [
        ...baseItems,
        {
          title: "Events",
          icon: Calendar,
          items: [
            { title: "CSO", path: "/events/cso" },
          ],
        },
        returnServiceItem,
      ];
    }

    // Admin type 3 gets School events
    if (admintype === 3) {
      return [
        ...baseItems,
        {
          title: "Events",
          icon: Calendar,
          items: [
            { title: "School", path: "/events/school" },
          ],
        },
        returnServiceItem,
      ];
    }

    // Admin type 4 gets Community events
    if (admintype === 4) {
      return [
        ...baseItems,
        {
          title: "Events",
          icon: Calendar,
          items: [
            { title: "Community", path: "/events/community" },
          ],
        },
        returnServiceItem,
      ];
    }

    return [...baseItems, returnServiceItem];
  };

  const navMain = getNavItems();

  const user = {
    name,
    email,
    avatar: "./logo.png",
  };

  const teams = {
    name: "scholaRSerbisyo",
    logo: GalleryVerticalEnd,
    plan: "Administration",
  };

  // Determine if the path is active
  const isActive = (path: string) => pathname.startsWith(path);

  // Toggle state for "Events" collapsible
  const [isEventsOpen, setIsEventsOpen] = useState(false);

  const toggleEvents = () => setIsEventsOpen((prev) => !prev);

  const onLogout = async () => {
    await signOut();
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-300 text-sidebar-primary-foreground">
                  <Image
                    src={"/logo_transparent.png"}
                    width={108}
                    height={108}
                    alt=""
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{teams.name}</span>
                  <span className="truncate text-xs">{teams.plan}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {navMain.map((item) => (
                <React.Fragment key={item.title}>
                  {'items' in item && item.items ? (
                    <Collapsible asChild open={isEventsOpen}>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild onClick={toggleEvents}>
                          <SidebarMenuButton tooltip={item.title}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            {isEventsOpen ? (
                              <ChevronDown className="ml-auto transition-transform duration-200" />
                            ) : (
                              <ChevronRight className="ml-auto transition-transform duration-200" />
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  className={
                                    isActive(subItem.path)
                                      ? "bg-[#191851] rounded-lg text-white hover:bg-[#191851] hover:text-white"
                                      : ""
                                  }
                                  asChild
                                >
                                  <Link href={subItem.path}>
                                    <span className="pl-4">{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <Link href={item.path}>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className={
                            isActive(item.path)
                              ? "bg-[#191851] rounded-lg text-white hover:bg-[#191851] hover:text-white"
                              : ""
                          }
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="rounded-lg">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user.name}</span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-2 px-1 py-1.5">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                      </Avatar>
                      <div className="grid text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user.name}</span>
                        <span className="truncate text-xs">{user.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Button
                      className="flex items-start w-full hover:bg-muted rounded-sm bg-transparent text-start text-black border-none p-2 hover:ease-in-out"
                      onClick={() => setIsFAQOpen(true)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <NavbarComponent>{children}</NavbarComponent>
      <FAQDialog isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
    </SidebarProvider>
  );
}

