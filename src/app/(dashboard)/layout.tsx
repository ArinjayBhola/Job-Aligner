

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // Basic protection
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <DashboardSidebar user={{ name: session.user?.name, email: session.user?.email, image: session.user?.image }} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 md:hidden bg-card">
           <div className="font-bold">JobAligner</div>
           {/* Mobile menu trigger would go here */}
        </header>
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
