import ViewAllEvents from "@/components/Events/CSO/SubComponents/ViewAllEvents";
import { fetchEvents } from "@/components/fetchingactions/_fetch";
import { Event } from "@/components/types";

export default async function ViewEventsPage() {
    const events: Event[] = await fetchEvents();

    return (
        <>
            <ViewAllEvents events={events} />
        </>
    )
}

