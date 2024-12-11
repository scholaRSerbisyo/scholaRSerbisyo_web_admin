import { DashboardFrame } from "@/components/Dashboard/Frame";
import { fetchedUser } from "@/components/Static/_actions/useractions";
import { User } from "@/components/types/usertype";
import { getScholars } from "@/components/Users/_actions/action"
import { Scholar } from "@/components/Users/UserFrame"

export default async function DashboardPage() {
    const type: User = await fetchedUser()

    const result = await getScholars()
  
    if ('error' in result) {
        // Handle the error case
        return <div>Error: {result.error}</div>
    }

    const scholars: Scholar[] = result.scholars
    return (
        <>
            <DashboardFrame admintype={type.admin.admin_type_id} scholars={scholars} />
        </>
    )
}