"use client"

import * as React from "react"
import AnalyticsComponent from "./Analytics"
import { ChartOverviewComponent } from "./ChartOverview"
import RSScholarListTabsComponent from "./ReturnServiceList/ReturnServiceListTabs"
import { UpcomingEventsComponents } from "./UpcomingEvents"
import AddEventButtonComponent from "../Static/AddEventFunction/AddEventButton"
import CalendarEvents from "../Features/Calendar/MultiSelectCalendar"
import { Scholar } from "@/components/Users/UserFrame"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardProps {
  admintype: number
  scholars: Scholar[]
}

export function DashboardFrame({ admintype, scholars }: DashboardProps) {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="flex flex-1 flex-col gap-4 lg:gap-4 p-2">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold sm:text-xl md:text-2xl">Overview</h1>
        {isLoading ? (
          <Skeleton className="h-10 w-[120px]" />
        ) : (
          <AddEventButtonComponent admintype={admintype} />
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-5 justify-between flex-1 rounded-lg border border-dashed shadow-sm p-1">
        <div className="flex flex-col justify-center gap-5 w-full lg:w-2/3 h-full">
          {isLoading ? <AnalyticsSkeleton /> : <AnalyticsComponent />}
          <div className="rounded-sm border py-5 pr-5">
            {isLoading ? <ChartSkeleton /> : <ChartOverviewComponent admintype={admintype} />}
          </div>
          <div className="p-2 rounded-sm border">
            {isLoading ? (
              <Skeleton className="h-[600px] w-full" />
            ) : (
              <RSScholarListTabsComponent scholars={scholars} />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full lg:w-1/3 h-full">
          <div className="flex justify-center items-center">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <CalendarEvents />
            )}
          </div>
          <div>
            {isLoading ? (
              <UpcomingEventsSkeleton />
            ) : (
              <UpcomingEventsComponents />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-3 sm:px-5 py-3 border rounded-sm">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="flex-1">
          <div className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-5" />
          </div>
          <div className="text-black">
            <Skeleton className="h-8 w-16 my-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[300px] w-full" />
      <div className="flex justify-center gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

function UpcomingEventsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-3">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}

