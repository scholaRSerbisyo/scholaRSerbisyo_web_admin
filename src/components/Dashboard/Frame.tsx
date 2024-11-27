"use client"; 

import * as React from "react";
import FullEventCalendar from "@/components/Features/Calendar/MultiSelectCalendar";
import AnalyticsComponent from "./Analytics";
import { ChartOverviewComponent } from "./ChartOverview";
import { RSScholarListTabsComponent } from "./ReturnServiceList/ReturnServiceListTabs";
import { UpcomingEventsComponents } from "./UpcomingEvents";
import DialogPaneComponent from "../Static/AddEventFunction/DialogPane";
import AddEventButtonComponent from "../Static/AddEventFunction/AddEventButton";

export function DashboardFrame() {

    return (  
        <main className="flex flex-1 flex-col gap-4 lg:gap-4 p-2">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold sm:text-xl md:text-2xl">Overview</h1>
                <AddEventButtonComponent />
            </div>
            <div className="flex flex-col lg:flex-row gap-5 justify-between flex-1 rounded-lg border border-dashed shadow-sm p-1">
                <div className="flex flex-col justify-center gap-5 w-full lg:w-2/3 h-full">
                    <AnalyticsComponent />
                    <div className="rounded-sm border">
                        <ChartOverviewComponent />
                    </div>
                    <div className="p-2 rounded-sm border">
                        <RSScholarListTabsComponent />
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-full lg:w-1/3 h-full">
                    <div className="flex justify-center items-center">
                        <FullEventCalendar />
                    </div>
                    <div>
                        <UpcomingEventsComponents />
                    </div>
                </div>
            </div>
        </main>
    )
}
