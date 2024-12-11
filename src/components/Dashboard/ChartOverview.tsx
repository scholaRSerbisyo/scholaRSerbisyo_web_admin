"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"

interface DataPoint {
  name: string
  CSO: number
  School: number
  Community: number
}

const data: DataPoint[] = [
  { name: "Jan", CSO: Math.floor(Math.random() * 5000) + 1000, School: Math.floor(Math.random() * 5000) + 1000, Community: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Feb", CSO: Math.floor(Math.random() * 5000) + 1000, School: Math.floor(Math.random() * 5000) + 1000, Community: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Mar", CSO: Math.floor(Math.random() * 5000) + 1000, School: Math.floor(Math.random() * 5000) + 1000, Community: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Apr", CSO: Math.floor(Math.random() * 5000) + 1000, School: Math.floor(Math.random() * 5000) + 1000, Community: Math.floor(Math.random() * 5000) + 1000 },
  { name: "May", CSO: Math.floor(Math.random() * 5000) + 1000, School: Math.floor(Math.random() * 5000) + 1000, Community: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jun", CSO: Math.floor(Math.random() * 5000) + 1000, School: Math.floor(Math.random() * 5000) + 1000, Community: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jul", CSO: Math.floor(Math.random() * 5000) + 1000, School: Math.floor(Math.random() * 5000) + 1000, Community: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Aug", CSO: Math.floor(Math.random() * 5000) + 1000, School: Math.floor(Math.random() * 5000) + 1000, Community: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Sep", CSO: Math.floor(Math.random() * 5000) + 1000, School: Math.floor(Math.random() * 5000) + 1000, Community: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Oct", CSO: Math.floor(Math.random() * 5000) + 1000, School: Math.floor(Math.random() * 5000) + 1000, Community: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Nov", CSO: Math.floor(Math.random() * 5000) + 1000, School: Math.floor(Math.random() * 5000) + 1000, Community: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dec", CSO: Math.floor(Math.random() * 5000) + 1000, School: Math.floor(Math.random() * 5000) + 1000, Community: Math.floor(Math.random() * 5000) + 1000 },
]

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: DataPoint
  }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload) return null

  return (
    <Card className="border-none">
      <CardContent className="p-3 space-y-1">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">{item.name}:</span>
            <span className="text-sm font-medium">
              {item.value.toLocaleString()} people
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

interface ChartProps {
  admintype: number
}

export function ChartOverviewComponent({admintype}: ChartProps) {
  const [visibility, setVisibility] = React.useState({
    CSO: true,
    School: true,
    Community: true,
  })

  return (
    <ChartContainer
      className="h-[350px] w-full"
      config={{
        CSO: {
          label: "CSO",
          color: "hsl(var(--chart-1))",
        },
        School: {
          label: "School",
          color: "hsl(var(--chart-2))",
        },
        Community: {
          label: "Community",
          color: "hsl(var(--chart-3))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value.toLocaleString()}`}
          />
          <ChartTooltip 
            content={<CustomTooltip />}
          />
          <ChartLegend />
          {visibility.CSO && (
            <Bar
              dataKey="CSO"
              fill="var(--color-CSO)"
              radius={[0, 0, 0, 0]}
            />
          )}
          {visibility.School && (
            <Bar
              dataKey="School"
              fill="var(--color-School)"
              radius={[0, 0, 0, 0]}
            />
          )}
          {visibility.Community && (
            <Bar
              dataKey="Community"
              fill="var(--color-Community)"
              radius={[0, 0, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

