"use client";

import * as React from "react";
import Image from "next/image";
import {
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  LayoutDashboardIcon,
  GalleryVerticalEnd,
  LogOut,
  Settings2,
  Sparkles,
} from "lucide-react";

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

export default function SidebarComponent({
  children,
  email,
  name,
}: Readonly<{
  children: React.ReactNode;
  email: string;
  name: string;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  // Sample data structure for user, teams, and nav items
  const {
    user,
    teams,
    navMain,
  } = {
    user: {
      name,
      email,
      avatar: "./logo.png",
    },
    teams: {
      name: "scholaRSerbisyo",
      logo: GalleryVerticalEnd,
      plan: "Scholar Administration",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
        path: "/dashboard",
      },
      {
        title: "Events",
        icon: Bot,
        items: [
          { title: "Baranggay", path: "/events/baranggay" },
          { title: "School", path: "/events/school" },
          { title: "CSO", path: "/events/cso" },
        ],
      },
      {
        title: "Scholar's List",
        icon: BookOpen,
        path: "/users",
      },
      {
        title: "Return Services Status",
        icon: Settings2,
        path: "/rsstatus",
      },
    ],
  };

  // Determine if the path is active
  const isActive = (path: string) => pathname.startsWith(path);

  // Logout and redirect to login page
  const onLogout = async () => {
    await signOut();
    router.push("/login"); // Adjust the route as needed
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src={"/logo.png"} width={108} height={108} alt="" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {teams.name}
                  </span>
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
                  {item.items ? (
                    <Collapsible
                      asChild
                      defaultOpen={item.items.some((subItem) =>
                        isActive(subItem.path)
                      )}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 rotate-0 group-data-[state=open]:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem
                                key={subItem.title}
                                className={isActive(subItem.path) ? "bg-muted text-primary" : ""}
                              >
                                <SidebarMenuSubButton asChild>
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
                      <SidebarMenuItem className={isActive(item.path) ? "bg-muted text-primary" : ""}>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
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
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user.name}</span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="bottom" align="end" sideOffset={4}>
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
                    <DropdownMenuItem><Sparkles />Upgrade to Pro</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link href="/account" className="flex items-center w-full hover:bg-muted rounded-sm p-2 hover:ease-in-out"><BadgeCheck />Account</Link>
                    <DropdownMenuItem><CreditCard />Billing</DropdownMenuItem>
                    <DropdownMenuItem><Bell />Notifications</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                    <LogOut />Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <NavbarComponent>{children}</NavbarComponent>
    </SidebarProvider>
  );
}
