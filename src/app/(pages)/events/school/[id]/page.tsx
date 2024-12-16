import { getSchool } from "@/components/Events/_actions/schools";
import { cookies } from "next/headers"; // To fetch the token
import { School, School2 } from "@/components/types";
import SchoolEvent from "@/components/Events/School/SubComponents/SchoolEvent";
import { fetchedUser } from "@/components/Static/_actions/useractions";

interface SchoolPageProps {
  params: { id: string };
}

export default async function SchoolPage({ params }: SchoolPageProps) {
  const { id } = params;

  try {
    // Fetch the school details with the token
    const school: School2 = await getSchool(id);
    const admintype = await fetchedUser();

    if (!school) {
      return (
        <div>
          <h1>School Not Found</h1>
          <p>No school found with ID: {id}</p>
        </div>
      );
    }

    return (
      <div>
        <SchoolEvent type={school.school.school_name} events={school.events} admintype={admintype.admin.admin_type_id}/>
      </div>
    );
  } catch (error: any) {
    return (
      <div>
        <h1>Error Loading School</h1>
        <p>{error.message || "An unexpected error occurred."}</p>
      </div>
    );
  }
}
