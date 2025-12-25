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
  
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:block h-screen sticky top-0 bg-background border-r border-border">
        <DashboardSidebar user={{ name: session.user?.name, email: session.user?.email, image: session.user?.image }} />
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-col min-h-screen bg-secondary/30">
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="h-14 border-b border-border bg-background flex items-center px-4 md:hidden sticky top-0 z-50">
           <span className="font-semibold text-lg">JobAligner</span>
           {/* Allow space for hamburger menu implementation later */}
        </header>

        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            {children}
        </div>
      </main>
    </div>
  );
}
