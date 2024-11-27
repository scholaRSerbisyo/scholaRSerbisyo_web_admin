import { getSchool } from "@/components/Events/_actions/schools"
import SchoolEvents from "@/components/Events/School/SubComponents/SchoolEvents"
import { School } from "@/components/types"
import { notFound } from "next/navigation"

export default async function SchoolPage({ params }: { params: { id: string } }) {
  const school: any = await getSchool(params.id);

  return <SchoolEvents school={school} />;
}

