"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllListSubComponent } from "./Subcomponents/AllList";
import { CompleteListSubComponent } from "./Subcomponents/CompleteList";
import { IncompleteListSubComponent } from "./Subcomponents/IncompleteList";
import { InactiveListSubComponent } from "./Subcomponents/InactiveList";

export function RSScholarListTabsComponent() {
    return (
        <Tabs defaultValue="all" className="w-full max-w-[40rem] mx-auto py-2">
            <TabsList className="mb-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="complete">Complete</TabsTrigger>
                <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
                <AllListSubComponent />
            </TabsContent>
            <TabsContent value="complete">
                <CompleteListSubComponent />
            </TabsContent>
            <TabsContent value="incomplete">
                <IncompleteListSubComponent />
            </TabsContent>
            <TabsContent value="inactive">
                <InactiveListSubComponent />
            </TabsContent>
        </Tabs>
    )
};
  