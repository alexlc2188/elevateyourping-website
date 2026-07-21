import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  header: string;
  actionButton?: {
    href: string;
    label: string;
  };
}

export const PageHeaderGeneric = ({ header, actionButton }: Props) => {
  return (
    <div className="py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">{header}</h1>

        {actionButton && (
          <Button asChild>
            <Link href={actionButton.href}>{actionButton.label}</Link>
          </Button>
        )}
      </div>
    </div>
  );
};
