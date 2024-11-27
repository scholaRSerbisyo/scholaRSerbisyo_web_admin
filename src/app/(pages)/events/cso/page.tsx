import CSOComponent from "@/components/Events/CSO/CSO";
import { fetchEvents } from "@/components/fetchingactions/_fetch";
import { Event } from "@/components/types";

export default async function CSOPage() {
    const event: Event[] = await fetchEvents();
    return (
        <>
            <CSOComponent events={event} />
        </>
    )
}