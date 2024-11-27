import { getUser } from "@/auth/user";
import { User } from "@/components/types/usertype";


export async function fetchedUser(): Promise<User> {
    try {
        const fetchedUser = await getUser();
        return fetchedUser
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Unable to fetch user");
    }
  }
  