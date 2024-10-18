"use client";
import Link from "next/link";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  Bookmark,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function SidebarComponent() {
    const router = usePathname();

    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:pl-6 lg:pr-2">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Package2 className="h-6 w-6" />
                        <span className="w-full text-[15px]">scholaRSerbisyo Admin</span>
                    </Link>
                    <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Toggle notifications</span>
                    </Button>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <Link
                            href="/dashboard"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${router === '/dashboard' ? 'bg-muted text-primary' : ''}`}
                        >
                            <Home className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/events"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${router === '/events' ? 'bg-muted text-primary' : ''}`}
                        >
                            <Bookmark className="h-4 w-4" />
                            Events
                            {/*<Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                            6
                            </Badge>*/}
                        </Link>
                        <Link
                            href="/profile"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${router === '/profile' ? 'bg-muted text-primary' : ''}`}
                        >
                            <Package className="h-4 w-4" />
                            Profile
                        </Link>
                        <Link
                            href="/users"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${router === '/users' ? 'bg-muted text-primary' : ''}`}
                        >
                            <Users className="h-4 w-4" />
                            Users
                        </Link>
                        <Link
                            href="#"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${router === '/' ? 'bg-muted text-primary' : ''}`}
                        >
                            <LineChart className="h-4 w-4" />
                            Analytics
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    )
}