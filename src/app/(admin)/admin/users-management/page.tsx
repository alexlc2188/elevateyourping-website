import { prismaDb } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { UserRoleForm } from "./_components/user-role-form";
import { z } from "zod";
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb";

const querySchema = z.object({
  email: z.string().optional(),
});

export default async function AdminUserManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const auth = await requireRole([UserRole.OWNER]);
  if (!auth.success) return notFound();

  const resolvedSearchParams = await searchParams;

  // Build the where clause based on search params
  const { email } = querySchema.parse(resolvedSearchParams);

  let user = null;
  if (email) {
    user = await prismaDb.user.findUnique({
      where: { email },
    });
  }

  async function handleSearch(formData: FormData) {
    "use server";
    const email = formData.get("email")?.toString();
    if (!email) return;
    redirect(`/admin/users-management?email=${email}`);
  }

  return (
    <main className=" mx-auto py-10 space-y-6">
      <AppBreadcrumb />
      <h1 className="text-2xl font-bold">User Management</h1>

      <form action={handleSearch} className="flex gap-4">
        <Input name="email" placeholder="Enter user email" />
        <Button type="submit">Search</Button>
      </form>

      {user ? (
        <div className="border p-4 rounded-md space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email:</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <UserRoleForm userId={user.id} currentRole={user.role as UserRole} />
        </div>
      ) : email ? (
        <p className="text-sm text-muted-foreground">
          No user found for that email.
        </p>
      ) : null}
    </main>
  );
}
