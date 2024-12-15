import CommunityScholarViewAllEvents from "@/components/Events/Community/SubComponents/CommunityViewAllEvents";
import { fetchCommunityEvents } from "@/components/fetchingactions/_fetch";
import { Event, ExtendedEvent } from "@/components/types";

export default async function ViewSchoolEventsPage() {
    const events: ExtendedEvent[] = await fetchCommunityEvents();

    return (
        <>
            <CommunityScholarViewAllEvents events={events} />
        </>
    )
}

