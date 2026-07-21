import { currentUser, isOwner } from "@/lib/auth";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Status = "Not Started" | "In Progress" | "Ready to use" | "Can Wait";

const statusStyles: Record<Status, string> = {
  "Not Started": "bg-slate-200 text-slate-800",
  "In Progress": "bg-yellow-200 text-yellow-900",
  "Ready to use": "bg-green-200 text-green-800",
  "Can Wait": "bg-purple-200 text-purple-800",
};

export default async function AdminPage() {
  const user = await currentUser();
  const role = user?.role ?? "USER";

  return (
    <main className="min-h-full w-full">
      {/* Hero Image Banner */}
      <div className="relative w-full h-[300px] lg:h-[200px] overflow-hidden">
        <Image
          src="/images/hero-admin.jpg"
          alt="Table Tennis Action"
          fill
          className="w-full h-full object-contain bg-black"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent p-6 flex items-start justify-center flex-col">
          <h1 className="text-white text-2xl md:text-4xl font-bold">
            Welcome, {user?.name} 👋
          </h1>
          <h2 className="text-5xl font-bold text-center text-white">
            Admin Dashboard
          </h2>
        </div>
      </div>

      {/* Admin Cards */}
      <div className="py-12 space-y-12">
        {/* Assignment & User Training */}
        <div>
          <h3 className="text-2xl  mb-4">Training Delivery & Assignment</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <LinkCard
              title="Pending Match Reviews"
              description="Review uploaded matches, add feedback, and create custom plans."
              href="/admin/matches"
              status="Ready to use"
            />
            {/* <LinkCard
              title="Assign Training"
              description="Assign matches, packs, or plans to users based on their needs."
              href="/admin/assignments"
              status="Not Started"
            /> */}
          </div>
        </div>

        {/* Content Management */}
        <div>
          <h3 className="text-2xl  mb-4">Content Management</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <LinkCard
              title="Manage Exercises"
              description="Edit drills used in plans and packs — includes duration, video, tags, etc."
              href="/admin/exercises"
              status="Ready to use"
            />
            <LinkCard
              title="Training Packs"
              description="Create and manage subscription packs with grouped exercises."
              href="/admin/training-packs"
              status="Ready to use"
            />
            <LinkCard
              title="Training Plans"
              description="Create and manage subscription plans for a player."
              href="/admin/training-plans"
              status="Can Wait"
            />
            <LinkCard
              title="Focus Areas"
              description="Define training categories like 'serve', 'footwork', or 'transition'."
              href="/admin/focus-areas"
              status="Can Wait"
            />
            <LinkCard
              title="Tags Management"
              description="Create Tags to find exercises faster like 'forehand chop', 'forehand loop'."
              href="/admin/tags"
              status="Ready to use"
            />
          </div>
        </div>

        {/* AI & System Tools */}
        <div>
          <h3 className="text-2xl  mb-4">AI & System Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            <LinkCard
              title="AI Prompts"
              description="Manage prompt templates used by AI to auto-review and suggest drills."
              href="/admin/ai-prompts"
              status="In Progress"
            />
            {isOwner(role) && (
              <LinkCard
                title="User Management"
                description="View users, promote admins, and inspect uploaded matches."
                href="/admin/users-management"
                status="Ready to use"
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function LinkCard({
  href,
  title,
  description,
  status,
}: {
  href: string;
  title: string;
  description: string;
  status: Status;
}) {
  return (
    <Link href={href} className="hover:no-underline group">
      <Card className="h-full relative hover:shadow-md transition-shadow duration-200">
        {/* Status badge */}
        <span
          className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-md ${statusStyles[status]}`}>
          {status}
        </span>

        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="pt-2">
            <Button
              variant="outline"
              className="w-full pointer-events-none group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-primary">
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
