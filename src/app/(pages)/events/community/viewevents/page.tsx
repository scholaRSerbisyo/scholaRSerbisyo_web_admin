import CommunityScholarViewAllEvents from "@/components/Events/Community/SubComponents/CommunityViewAllEvents";
import { fetchCommunityEvents } from "@/components/fetchingactions/_fetch";
import { fetchedUser } from "@/components/Static/_actions/useractions";
import { Event, ExtendedEvent } from "@/components/types";

export default async function ViewSchoolEventsPage() {
    const events: ExtendedEvent[] = await fetchCommunityEvents();
    const admintype = await fetchedUser()

    return (
        <>
            <CommunityScholarViewAllEvents admintype={admintype.admin.admin_type_id} events={events} />
        </>
    )
}

