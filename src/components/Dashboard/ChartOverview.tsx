"use client";

import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip } from "recharts";

const data = [
    { name: "Jan", CSO: Math.floor(Math.random() * 5000) + 1000, School: Math.floor(Math.random() * 5000) + 1000, Community: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Feb", CSO: Math.floor(Math.random() * 5000) + 1000, School: Math.floor(Math.random() * 5000) + 1000, Community: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Mar", CSO: Math.floor(Math.random() * 5000) + 1000, School: Math.floor(Math.random() * 5000) + 1000, Community: Math.floor(Math.random() * 5000) + 1000 },
    // Add additional months as needed
];

const colors = {
    CSO: "#ff6347", // Red for CSO
    School: "#4682b4", // Blue for School
    Community: "#32cd32" // Green for Community
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-popover text-popover-foreground shadow-md rounded-md border border-border text-sm">
                <p className="font-semibold">{`${label}`}</p>
                {payload.map((entry, index) => (
                    <p key={`tooltip-${index}`} style={{ color: entry.color }}>
                        {`${entry.name}: ${entry.value} people`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export function ChartOverviewComponent() {
    const [visibility, setVisibility] = useState({
        CSO: true,
        School: true,
        Community: true
    });

    type Category = "CSO" | "School" | "Community";


    return (
        <div className="p-4">

            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Legend layout="vertical" align="right" verticalAlign="middle" />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />

                    {visibility.CSO && <Bar dataKey="CSO" fill={colors.CSO} name="CSO" radius={[4, 4, 0, 0]} />}
                    {visibility.School && <Bar dataKey="School" fill={colors.School} name="School" radius={[4, 4, 0, 0]} />}
                    {visibility.Community && <Bar dataKey="Community" fill={colors.Community} name="Community" radius={[4, 4, 0, 0]} />}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
