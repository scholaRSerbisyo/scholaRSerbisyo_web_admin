"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Scholar {
  id: number
  firstname: string
  lastname: string
  mobilenumber: string
  age: string
  yearLevel: string
  scholarType: string
  school: {
    id: number
    name: string
  }
  barangay: {
    id: number
    name: string
  }
  returnServiceCount: number
  created_at: string
}

interface DataPoint {
  name: string
  CSO: number
  School: number
  Community: number
}

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
            <span className="text-sm font-medium">{item.value.toLocaleString()} scholars</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

interface ChartProps {
  scholars: Scholar[]
}

export function ChartOverviewComponent({ scholars }: ChartProps) {
  const [visibility, setVisibility] = React.useState({
    CSO: true,
    School: true,
    Community: true,
  })

  // Process scholars data for current year only
  const data = React.useMemo(() => {
    const currentYear = new Date().getFullYear()
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const monthlyData = months.map((month) => ({
      name: month,
      CSO: 0,
      School: 0,
      Community: 0,
    }))

    // Filter scholars for current year and process data
    scholars
      .filter((scholar) => {
        const scholarDate = new Date(scholar.created_at)
        return scholarDate.getFullYear() === currentYear
      })
      .forEach((scholar) => {
        const date = new Date(scholar.created_at)
        const monthIndex = date.getMonth()
        const scholarType = scholar.scholarType

        if (scholarType === "CSO Scholar") {
          monthlyData[monthIndex].CSO++
        } else if (scholarType === "School Based") {
          monthlyData[monthIndex].School++
        } else if (scholarType === "Community Based") {
          monthlyData[monthIndex].Community++
        }
      })

    return monthlyData
  }, [scholars])

  const currentYear = new Date().getFullYear()

  return (
    <Card className="border-none">
      <CardContent>
        <ChartContainer
          className="h-[350px] w-full"
          config={{
            CSO: {
              label: "CSO Scholar",
              color: "hsl(var(--chart-1))",
            },
            School: {
              label: "School Based",
              color: "hsl(var(--chart-2))",
            },
            Community: {
              label: "Community Based",
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
              <ChartTooltip content={<CustomTooltip />} />
              <ChartLegend />
              {visibility.CSO && <Bar dataKey="CSO" fill="var(--color-CSO)" radius={[4, 4, 0, 0]} />}
              {visibility.School && <Bar dataKey="School" fill="var(--color-School)" radius={[4, 4, 0, 0]} />}
              {visibility.Community && <Bar dataKey="Community" fill="var(--color-Community)" radius={[4, 4, 0, 0]} />}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

