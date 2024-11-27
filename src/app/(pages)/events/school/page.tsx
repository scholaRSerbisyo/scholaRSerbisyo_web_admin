import SchoolComponent from "@/components/Events/School/School";
import { fetchSchools } from "@/components/fetchingactions/_fetch";
import { School } from "@/components/types";

export default async function SchoolPage() {
    const schools: School[] = await fetchSchools();
    return (
        <>
            <SchoolComponent schools={schools} />
        </>
    )
}