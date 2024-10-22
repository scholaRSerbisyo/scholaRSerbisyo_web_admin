"use client";

import * as React from "react"
import Image from "next/image";
import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  LayoutDashboardIcon,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import NavbarComponent from "./Navbar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { signOut } from "@/auth/auth";

export default function SidebarComponent({
    children, email
  }: Readonly<{
    children: React.ReactNode,
    email: any;
  }>) {
    const router = usePathname();

    const data = {
        user: {
          name: "Admin",
          email: email,
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
            path: '/dashboard'
          },
          {
            title: "Events",
            icon: Bot,
            items: [
              {
                title: "Baranggay",
                path: '/genesis'
              },
              {
                title: "School",
                path: '/explorer'
              },
              {
                title: "CSO",
                path: '/quantum'
              },
            ],
          },
          {
            title: "Scholar's List",
            icon: BookOpen,
            path: '/list'
          },
          {
            title: "Return Services Status",
            icon: Settings2,
            path: '/rsstatus'
          },
        ],
      }

      const onLogout = async () => {
        await signOut();
      }

      const isActive = (path: string) => path === router;

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                  <SidebarMenu>
                      <SidebarMenuItem>
                          <SidebarMenuButton
                              onClick={() => {  }}
                              size="lg"
                              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                          >
                              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                              <Image src={'/logo.png'} width={108} height={108} alt=""/>
                              </div>
                              <div className="grid flex-1 text-left text-sm leading-tight">
                              <span className="truncate font-semibold">
                                  {data.teams.name}
                              </span>
                              <span className="truncate text-xs">
                                  {data.teams.plan}
                              </span>
                              </div>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                      <SidebarMenu>
                      {data.navMain.map((item) => (
                          <>
                          {
                              item.items === undefined?
                              <Link
                                  key={item.title}
                                  className={`rounded-sm ${isActive(item.path) ? 'bg-muted text-primary' : ''}`} 
                                  href={item.path}
                              >
                                  <SidebarMenuItem>
                                      <SidebarMenuButton tooltip={item.title} className={`${isActive(item.path) ? 'hover:bg-muted hover:text-primary' : ''}`}>
                                          {item.icon && <item.icon />}
                                          <span>{item.title}</span>
                                      </SidebarMenuButton>
                                  </SidebarMenuItem>
                              </Link>
                              :
                              <Collapsible
                                  key={item.title}
                                  asChild
                                  defaultOpen={isActive('/genesis') || isActive('/explorer') || isActive('/quantum')}
                                  className="group/collapsible"
                                  >
                                  <SidebarMenuItem>
                                      <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title} className={isActive(subItem.path) ? 'bg-muted text-primary' : ''}>
                                                <SidebarMenuSubButton asChild>
                                                <a href={subItem.path}>
                                                    <span>{subItem.title}</span>
                                                </a>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                      </CollapsibleContent>
                                  </SidebarMenuItem>
                              </Collapsible>
                          }
                          </>
                      ))}
                      </SidebarMenu>
                  </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                  <SidebarMenu>
                      <SidebarMenuItem>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                          <SidebarMenuButton
                              size="lg"
                              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                          >
                              <Avatar className="h-8 w-8 rounded-lg">
                              <AvatarImage
                                  src={data.user.avatar}
                                  alt={data.user.name}
                              />
                              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                              </Avatar>
                              <div className="grid flex-1 text-left text-sm leading-tight">
                              <span className="truncate font-semibold">
                                  {data.user.name}
                              </span>
                              <span className="truncate text-xs">
                                  {data.user.email}
                              </span>
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
                          <DropdownMenuLabel className="p-0 font-normal">
                              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                              <Avatar className="h-8 w-8 rounded-lg">
                                  <AvatarImage
                                  src={data.user.avatar}
                                  alt={data.user.name}
                                  />
                                  <AvatarFallback className="rounded-lg">
                                  CN
                                  </AvatarFallback>
                              </Avatar>
                              <div className="grid flex-1 text-left text-sm leading-tight">
                                  <span className="truncate font-semibold">
                                  {data.user.name}
                                  </span>
                                  <span className="truncate text-xs">
                                  {data.user.email}
                                  </span>
                              </div>
                              </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                              <DropdownMenuItem>
                              <Sparkles />
                              Upgrade to Pro
                              </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                              <DropdownMenuItem>
                              <BadgeCheck />
                              Account
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                              <CreditCard />
                              Billing
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                              <Bell />
                              Notifications
                              </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
                              <LogOut />
                              Log out
                          </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                      </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
            <NavbarComponent children={children} />
        </SidebarProvider>
    )
}