import { CalendarDays, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";

const notifications = [
    {
        title: "Scholar's Cup",
        description: "December 12, 2024 - CSO",
    },
    {
        title: "Mitumaw",
        description: "January 5, 2024 - Community",
    },
    {
        title: "Panaghiusa",
        description: "January 20, 2024 - School",
    },
]

type CardProps = React.ComponentProps<typeof Card>

export function UpcomingEventsComponents({ className, ...props }: CardProps) {
  return (
    <Card className="w-full max-w-auto sm:w-auto mx-auto">
        <CardHeader className="rounded-t-lg bg-ys">
            <CardTitle className="flex justify-between pr-20 text-black items-center"><CalendarDays color="black" />Upcoming Events</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-4 py-5">
            <div>
                {notifications.map((notification, index) => (
                    <div key={index} className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
        <CardFooter>
            <Button className="w-full bg-ys text-black hover:bg-yellow-300">
                View All
            </Button>
        </CardFooter>
    </Card>
  )
}
