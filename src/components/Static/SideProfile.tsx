
import { getUser } from "@/auth/user";
import SidebarComponent from "./Sidebar";
import { fetchedUser } from "./_actions/useractions";
import { User } from "../types/usertype";


export default async function SideProfileFrame({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const user: User = await fetchedUser();
    return (
        <>
            <SidebarComponent children={children} email={user.email} name={user.admin.admin_name} admintype={user.admin.admin_type_id} />
        </>
    )
}