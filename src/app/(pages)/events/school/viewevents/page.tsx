import SchoolScholarViewAllEvents from "@/components/Events/School/SubComponents/SchoolViewAllEvents";
import { fetchSchoolEvents } from "@/components/fetchingactions/_fetch";
import { fetchedUser } from "@/components/Static/_actions/useractions";
import { Event, ExtendedEvent } from "@/components/types";

export default async function ViewSchoolEventsPage() {
    const events: ExtendedEvent[] = await fetchSchoolEvents();
    const admintype = await fetchedUser()

    return (
        <>
            <SchoolScholarViewAllEvents admintype={admintype.admin.admin_type_id} events={events} />
        </>
    )
}

