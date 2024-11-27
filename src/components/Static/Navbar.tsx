"use client";

import { useState, useEffect } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ModeButton } from "./dark-mode";

export default function NavbarComponent({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = usePathname();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Generate breadcrumb links based on the current path
    const breadcrumbLinks = router
        .split('/')
        .filter((segment) => segment) // Remove empty segments
        .map((segment, index, array) => {
            const href = `/${array.slice(0, index + 1).join('/')}`;
            const isLast = index === array.length - 1;

            return (
                <BreadcrumbItem key={href} className="flex items-center"> {/* Flex aligns text and separator */}
                    {isLast ? (
                        <BreadcrumbPage>{segment.charAt(0).toUpperCase() + segment.slice(1)}</BreadcrumbPage>
                    ) : (
                        <Link href={href}>
                            <BreadcrumbLink>{segment.charAt(0).toUpperCase() + segment.slice(1)}</BreadcrumbLink>
                        </Link>
                    )}
                    {!isLast && <BreadcrumbSeparator className="mx-1" />} {/* Adjust space around separator */}
                </BreadcrumbItem>
            );
        });

    return (
        <SidebarInset>
            <header
                className={`sticky top-0 flex items-center gap-2 bg-background justify-between shadow-sm transition-[height] duration-200 ease-linear shrink-0 z-10 pr-5
                    ${isSidebarCollapsed ? "h-12" : "h-16"}
                `}
            >
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" onClick={() => setIsSidebarCollapsed((prev) => !prev)} />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    {isMounted && (
                        <Breadcrumb>
                            <BreadcrumbList className="flex items-center space-x-1"> {/* Ensure flex container and horizontal spacing */}
                                {breadcrumbLinks}
                            </BreadcrumbList>
                        </Breadcrumb>
                    )}
                </div>
                <ModeButton />
            </header>
            <div className="flex flex-1 flex-col mt-2 gap-4 p-4 pt-0">
                {children}
            </div>
        </SidebarInset>
    );
}
