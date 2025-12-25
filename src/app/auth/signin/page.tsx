
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignInContent from "./signin-client";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return <SignInContent />;
}
