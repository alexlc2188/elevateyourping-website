// import Footer from '@/components/footer/footer'

import { auth } from "@/auth";
import { NavbarApp } from "@/components/navigation/navbar-app";
import { ConfettiProvider } from "@/providers/confetti-provider";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  // ✅ Check if user is logged in
  if (!session?.user) {
    redirect("/auth/login");
  }

  // ✅ Check if user is admin
  if (session.user.role === UserRole.USER) {
    redirect("/"); // or show a 403 page
  }
  return (
    <div className="flex h-full flex-col">
      <div className="fixed inset-y-0 z-50 h-[80px] w-full">
        <NavbarApp />
      </div>
      <main className=" pt-[80px] max-w-6xl mx-auto w-full h-full">
        <ConfettiProvider />
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default AdminLayout;
