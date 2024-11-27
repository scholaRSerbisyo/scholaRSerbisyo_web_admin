import { Scholar } from "@/components/types/usertype";
import { getScholars } from "@/components/Users/_actions/action";
import { ScholarTableWithTabs } from "@/components/Users/UserFrame";

export default async function RSStatusFrame() {
    const scholars: Scholar[] = await getScholars();

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <ScholarTableWithTabs scholars={scholars}/>
        </main>
    );
}