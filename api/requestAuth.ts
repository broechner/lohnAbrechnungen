import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export const getRequestUserEmail = async (): Promise<string | null> => {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email || typeof email !== "string") {
    return null;
  }

  return email.toLowerCase();
};
