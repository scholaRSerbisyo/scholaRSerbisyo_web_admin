import CommunityComponent from "@/components/Events/Community/Community"
import { fetchBarangays, fetchSchools } from "@/components/fetchingactions/_fetch";
import { Baranggay, School } from "@/components/types";

export default async function CommunityPage() {
    const barangay: Baranggay[] = await fetchBarangays();
    return (
        <>
            <CommunityComponent barangays={barangay} />
        </>
    )
}