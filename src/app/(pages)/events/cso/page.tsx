import CSOComponent from "@/components/Events/CSO/CSO";
import { fetchEvents } from "@/components/fetchingactions/_fetch";
import { fetchedUser } from "@/components/Static/_actions/useractions";
import { Event } from "@/components/types";

export default async function CSOPage() {
    const event: Event[] = await fetchEvents();
    const type = await fetchedUser()
    return (
        <>
            <CSOComponent events={event} admintype={type.admin.admin_type_id} />
        </>
    )
}