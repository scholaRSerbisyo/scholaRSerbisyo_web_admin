import CommunityComponent from "@/components/Events/Community/Community";
import { fetchBarangays } from "@/components/fetchingactions/_fetch";
import { fetchedUser } from "@/components/Static/_actions/useractions";
import { cookies } from "next/headers";

export default async function SchoolPage() {
    const baranggays = await fetchBarangays();
    const type = await fetchedUser()
    return (
        <>
            <CommunityComponent barangays={baranggays} admintype={type.admin.admin_type_id} />
        </>
    );
}
