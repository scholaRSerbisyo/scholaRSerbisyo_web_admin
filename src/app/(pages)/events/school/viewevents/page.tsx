import SchoolScholarViewAllEvents from "@/components/Events/School/SubComponents/SchoolViewAllEvents";
import { fetchSchoolEvents } from "@/components/fetchingactions/_fetch";
import { Event, ExtendedEvent } from "@/components/types";

export default async function ViewSchoolEventsPage() {
    const events: ExtendedEvent[] = await fetchSchoolEvents();

    return (
        <>
            <SchoolScholarViewAllEvents events={events} />
        </>
    )
}

