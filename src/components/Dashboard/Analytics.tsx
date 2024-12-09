"use client"

import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Clipboard, UserCheck, UserX } from 'lucide-react';
import { getScholars } from '../Users/_actions/action';
import { Scholar } from '../Users/UserFrame';

export default function AnalyticsComponent() {
    const [completeCount, setCompleteCount] = useState(0);
    const [incompleteCount, setIncompleteCount] = useState(0);

    useEffect(() => {
        async function fetchScholars() {
            const result = await getScholars();
            if ('scholars' in result && Array.isArray(result.scholars)) {
                const scholars: Scholar[] = result.scholars;
                const complete = scholars.filter(scholar => scholar.returnServiceCount >= 5).length;
                const incomplete = scholars.filter(scholar => scholar.returnServiceCount < 5).length;
                setCompleteCount(complete);
                setIncompleteCount(incomplete);
            }
        }
        fetchScholars();
    }, []);

    return (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-3 sm:px-5 py-3 border rounded-sm">
            <Card className="flex-1 bg-green-400">
                <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-1 pt-3">
                    <UserCheck color="green" />
                </CardHeader>
                <CardContent className="text-black">
                    <div className="text-2xl font-bold text-center">{completeCount}</div>
                    <p className="text-xs text-center">
                        Complete Return Service
                    </p>
                </CardContent>
            </Card>
            <Card className="flex-1 bg-red-400">
                <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-1 pt-3">
                    <Clipboard color="red" />
                </CardHeader>
                <CardContent className="text-black">
                    <div className="text-2xl font-bold text-center">{incompleteCount}</div>
                    <p className="text-xs text-center">
                        Incomplete Return Service
                    </p>
                </CardContent>
            </Card>
            <Card className="flex-1 bg-purple-400">
                <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-1 pt-3">
                    <UserX color="purple" />
                </CardHeader>
                <CardContent className="text-black">
                    <div className="text-2xl font-bold text-center">0</div>
                    <p className="text-xs text-center">
                        Inactive
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

