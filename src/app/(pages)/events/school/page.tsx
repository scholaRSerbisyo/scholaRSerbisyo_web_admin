import SchoolComponent from "@/components/Events/School/School";
import { fetchSchools } from "@/components/fetchingactions/_fetch";
import { fetchedUser } from "@/components/Static/_actions/useractions";

export default async function SchoolPage() {
    const schools = await fetchSchools();
    const type = await fetchedUser()
    return (
        <>
            <SchoolComponent schools={schools} admintype={type.admin.admin_type_id} />
        </>
    );
}
