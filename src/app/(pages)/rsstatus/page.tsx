import { getScholars } from "@/components/Users/_actions/action"
import { ScholarTableWithTabs } from "@/components/Users/UserFrame"
import { Scholar } from "@/components/Users/UserFrame"

export default async function RSStatusPage() {
  const result = await getScholars()
  

  const scholars: Scholar[] = result.scholars

  return <ScholarTableWithTabs scholars={scholars} />
}

