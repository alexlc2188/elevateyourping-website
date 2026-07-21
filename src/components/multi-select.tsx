// components/ui/multi-select.tsx
"use client";

import * as React from "react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
  id: string;
  label: string;
};

type MultiSelectProps = {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
};

export function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleValue = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((val) => val !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const getLabel = (id: string) => options.find((o) => o.id === id)?.label;

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between">
            {selected.length > 0
              ? `${selected.length} selected`
              : `Select ${label.toLowerCase()}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 max-h-64 overflow-y-auto">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandList>
              {options.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.label}
                  onSelect={() => toggleValue(item.id)}
                  className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Check
                      className={cn(
                        "h-4 w-4",
                        selected.includes(item.id)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {item.label}
                  </div>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected badges */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selected.map((id) => (
            <Badge
              key={id}
              variant="secondary"
              className="flex items-center gap-1">
              {getLabel(id)}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => toggleValue(id)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
