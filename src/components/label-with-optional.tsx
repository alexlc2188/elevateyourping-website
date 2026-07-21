import { FormLabel } from "./ui/form";

type LabelProps = {
  children: React.ReactNode;
  optional?: boolean;
  hasValue?: boolean;
};

export const LabelWithOptional = ({
  children,
  optional,
  hasValue,
}: LabelProps) => (
  <FormLabel>
    {children}
    {optional ? (
      <span className="ml-1 text-sm text-muted-foreground">(optional)</span>
    ) : !hasValue ? (
      <span className="ml-auto text-red-500">* required</span>
    ) : null}
  </FormLabel>
);
