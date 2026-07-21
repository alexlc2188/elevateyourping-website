"use client";

import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { userRoleFormSchema } from "@/lib/utils/user-role-management";
import { updateUserRoleAction } from "@/actions/admin/userRoleActions";

export function UserRoleForm({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: UserRole;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof userRoleFormSchema>>({
    resolver: zodResolver(userRoleFormSchema),
    defaultValues: { role: currentRole },
  });

  const onSubmit = (values: z.infer<typeof userRoleFormSchema>) => {
    startTransition(async () => {
      const { success, error } = await updateUserRoleAction({
        userId,
        role: values.role,
      });

      if (!success) {
        toast.error(error || "Failed to update role");
        return;
      }

      toast.success("Role updated");
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  disabled={isPending}
                  value={field.value}
                  onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="COACH">Coach</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="OWNER">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} size="sm">
          Update Role
        </Button>
      </form>
    </Form>
  );
}
