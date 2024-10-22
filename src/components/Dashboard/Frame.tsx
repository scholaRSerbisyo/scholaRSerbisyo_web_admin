"use client";

import { useEffect, useState } from "react"
 
import { Calendar } from '@/components/ui/calendar';
import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export const description = "A radial chart with text";

const BaranggaychartData = [
  { 
    visitors: 790, 
    fill: "#9747FF",
    maxVisitors: 1000
  },
];

const SchoolchartData = [
  { 
    visitors: 890, 
    fill: "#F15742",
    maxVisitors: 1000
  },
];

const CSOchartData = [
  { 
    visitors: 690, 
    fill: "#EB3EA6",
    maxVisitors: 1000
  },
];

const chartConfig = {
  visitors: {
    label: "Scholars",
  },
} satisfies ChartConfig;

export function DashboardFrame() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    useEffect(() => {
      const intervalId = setInterval(() => {
        setDate(new Date());
      }, 1000); // Update every second
    
      return () => clearInterval(intervalId);
    }, []);

    return (  
        <main className="flex flex-1 flex-col gap-2 p-2 lg:gap-3 lg:p-3">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Overview</h1>
            </div>
            <div
                className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
            >
              
            </div>
        </main>
    )
}
