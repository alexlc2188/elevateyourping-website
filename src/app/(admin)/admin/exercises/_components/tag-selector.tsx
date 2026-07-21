"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Check, X } from "lucide-react";
import { Tag } from "@prisma/client";

type Props = {
  availableTags: Tag[];
  selectedTags: string[];
  onChange: (tagIds: string[]) => void;
  onCreateTag: (label: string) => void;
};

export function TagSelector({
  availableTags,
  selectedTags,
  onChange,
  onCreateTag,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggleTag = (id: string) => {
    if (selectedTags.includes(id)) {
      onChange(selectedTags.filter((tagId) => tagId !== id));
    } else {
      onChange([...selectedTags, id]);
    }
  };

  const handleCreate = () => {
    const trimmed = search.trim();
    if (!trimmed) return;
    onCreateTag(trimmed);
    setSearch("");
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left">
            {selectedTags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedTags.map((id) => {
                  const tag = availableTags.find((t) => t.id === id);
                  return tag ? (
                    <Badge className="" key={id}>
                      {tag.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            ) : (
              "Select tags"
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-72 p-0">
          <Command>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Search or create..."
            />
            <CommandList>
              {availableTags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  onSelect={() => toggleTag(tag.id)}
                  className="flex items-center justify-between ">
                  {tag.name}
                  {selectedTags.includes(tag.id) && (
                    <Check className="w-4 h-4" />
                  )}
                </CommandItem>
              ))}

              <CommandEmpty>
                <div className="flex items-center justify-between">
                  <span>No tag found</span>
                  {search.trim().length > 0 && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleCreate}
                      className="text-xs px-2">
                      <Plus className="w-3 h-3 mr-1" />
                      Create “{search}”
                    </Button>
                  )}
                </div>
              </CommandEmpty>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
