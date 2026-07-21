import { BackButton } from "@/components/back-button";
import { ContactForm } from "./_components/ContactForm";
import { currentUser } from "@/lib/auth";

export default async function ContactPage() {
  const user = await currentUser();

  return (
    <div className="max-w-2xl lg:max-w-5xl mx-auto px-4 py-12 space-y-6">
      <BackButton />
      <h1 className="text-3xl">Contact Us</h1>
      <ContactForm name={user?.name} email={user?.email} />
    </div>
  );
}
