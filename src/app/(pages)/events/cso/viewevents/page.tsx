import { fetchEvents } from "@/components/fetchingactions/_fetch";
import ViewAllEvents from "@/components/Events/CSO/SubComponents/ViewAllEvents";
import { Event } from "@/components/types";

export default async function ViewEventsPage() {
    const event: Event[] = await fetchEvents();

    return (
        <>
            <ViewAllEvents events={event}/>
        </>
    )
}