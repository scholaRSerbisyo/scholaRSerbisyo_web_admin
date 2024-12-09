import { getBaranggay } from "@/components/Events/_actions/barangays";
import { cookies } from "next/headers"; // To fetch the token
import { Baranggay2 } from "@/components/types";
import SchoolEvent from "@/components/Events/School/SubComponents/SchoolEvent";
import { fetchedUser } from "@/components/Static/_actions/useractions";

interface CommunityPageProps {
  params: { id: string };
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { id } = params;

  try {
    // Retrieve the token from cookies
    const token = cookies().get("session")?.value;

    if (!token) {
      throw new Error("Authorization token is missing");
    }

    // Fetch the school details with the token
    const baranggay: Baranggay2 = await getBaranggay(id, token);
    const admintype = await fetchedUser();

    console.log(baranggay)
    if (!baranggay) {
      return (
        <div>
          <h1>Barangay Not Found</h1>
          <p>No barangay found with ID: {id}</p>
        </div>
      );
    }

    return (
      <div>
        <SchoolEvent type={baranggay.baranggay.baranggay_name} events={baranggay.events} admintype={admintype.admin.admin_type_id}/>
        {/* Add components or layout for the specific school's details */}
      </div>
    );
  } catch (error: any) {
    return (
      <div>
        <h1>Error Loading Barangay</h1>
        <p>{error.message || "An unexpected error occurred."}</p>
      </div>
    );
  }
}
