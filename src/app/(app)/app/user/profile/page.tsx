import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AccountTabs } from "../_components/AccountTabs";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getInitials } from "@/lib/user";
import { UserPageWrapper } from "../_components/UserPageWrapper";
import { Header } from "../_components/Header";

export default async function UserPreferencesPage() {
  const user = await currentUser();

  if (!user) redirect("/auth/login");

  return (
    <UserPageWrapper>
      <Header title="My account" />

      <AccountTabs />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className=" text-2xl">User avatar</h2>
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user?.image ?? ""} alt="User avatar" />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              {/* <Button variant="outline">Upload</Button> */}
              <p>{user?.name ?? ""}</p>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className=" text-2xl">Personal data</h2>
            <Input placeholder="First name" defaultValue={user.name} disabled />
          </CardContent>
        </Card> */}

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className=" text-2xl">Email</h2>
            <Input value={user.email ?? ""} disabled />
          </CardContent>
        </Card>

        {/* <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className=" text-lg">Select preferred software</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">Avid</Button>
              <Button variant="outline">Adobe Premiere</Button>
              <Button variant="outline">Adobe After Effects</Button>
              <Button variant="outline">DaVinci Resolve</Button>
              <Button>FCP</Button>
              <Button>Apple Motion</Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </UserPageWrapper>
  );
}
