import { DashboardClient } from "./dashboard-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return <DashboardClient userId={session?.user?.id} />;
}
