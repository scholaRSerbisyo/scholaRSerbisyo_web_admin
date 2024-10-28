
import { getUser } from "@/auth/user";
import SidebarComponent from "./Sidebar";


export default async function SideProfileFrame({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const user = await getUser();
    return (
        <>
            <SidebarComponent children={children} email={user.email} />
        </>
    )
}