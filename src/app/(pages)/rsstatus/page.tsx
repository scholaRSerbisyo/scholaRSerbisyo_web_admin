import { getScholars } from "@/components/Users/_actions/action"
import { ScholarTableWithTabs } from "@/components/Users/UserFrame"
import { Scholar } from "@/components/Users/UserFrame"

export default async function RSStatusPage() {
  const result = await getScholars()
  
  if ('error' in result) {
    // Handle the error case
    return <div>Error: {result.error}</div>
  }

  const scholars: Scholar[] = result.scholars

  return <ScholarTableWithTabs scholars={scholars} />
}

