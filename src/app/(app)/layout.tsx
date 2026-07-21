// import Footer from '@/components/footer/footer'

import { auth } from "@/auth";
import { NavbarApp } from "@/components/navigation/navbar-app";
import SessionProviders from "@/providers/session-provider";
import { redirect } from "next/navigation";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <SessionProviders>
      <div className="flex h-full flex-col">
        <div className="fixed inset-y-0 z-50 h-[80px] w-full">
          <NavbarApp />
        </div>
        <main className="flex-1 pt-[80px]">{children}</main>

        {/* <Footer /> */}
      </div>
    </SessionProviders>
  );
};

export default AppLayout;
