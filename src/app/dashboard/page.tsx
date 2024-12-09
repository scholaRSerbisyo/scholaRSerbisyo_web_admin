import { DashboardFrame } from "@/components/Dashboard/Frame";
import { fetchedUser } from "@/components/Static/_actions/useractions";
import { User } from "@/components/types/usertype";


export default async function DashboardPage() {
    const type: User = await fetchedUser()
    return (
        <>
            <DashboardFrame admintype={type.admin.admin_type_id} />
        </>
    )
}