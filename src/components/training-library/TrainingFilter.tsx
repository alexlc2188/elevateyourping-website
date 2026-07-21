import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TrainingFilter({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex justify-end px-4 pt-4">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-40 sm:w-48 bg-white border-black/20 text-black text-sm capitalize">
          <SelectValue placeholder="Filter by" />
        </SelectTrigger>
        <SelectContent className="bg-white text-black border-white/20">
          {options.map((option) => (
            <SelectItem className="capitalize" key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
