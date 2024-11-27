
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Clipboard, UserCheck, UserX } from "lucide-react";

export default function AnalyticsComponent() {
    return (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-3 sm:px-5 py-3 border rounded-sm">
            <Card className="flex-1 bg-green-400">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
                    <CardTitle className="text-sm font-medium">

                    </CardTitle>
                    <UserCheck color="green" />
                </CardHeader>
                <CardContent className="text-black">
                    <div className="text-2xl font-bold text-center">1,143</div>
                    <p className="text-xs text-center">
                        Complete Return Service
                    </p>
                </CardContent>
            </Card>
            <Card className="flex-1 bg-red-400">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
                    <CardTitle className="text-sm font-medium">
                        
                    </CardTitle>
                    <Clipboard color="red" />
                </CardHeader>
                <CardContent className="text-black">
                    <div className="text-2xl font-bold text-center">120</div>
                    <p className="text-xs text-center">
                        Incomplete
                    </p>
                </CardContent>
            </Card>
            <Card className="flex-1 bg-purple-400">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
                    <CardTitle className="text-sm font-medium">

                    </CardTitle>
                    <UserX color="purple" />
                </CardHeader>
                <CardContent className="text-black">
                    <div className="text-2xl font-bold text-center">84</div>
                    <p className="text-xs text-center">
                        Inactive
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}