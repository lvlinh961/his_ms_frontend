import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn, removeVietnameseTones } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SelectBoxSuggestProps {
  options: { id: string; name: string; code?: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const SelectBoxSuggest = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: SelectBoxSuggestProps) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find(
    (opt) => String(opt.id) === String(value),
  );

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
          )}
        >
          {selectedOption ? selectedOption.name : placeholder || "Chọn..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 z-[9999]"
        align="start"
      >
        <Command
          shouldFilter={true}
          filter={(value, search) => {
            const normalizedValue = removeVietnameseTones(value);
            const normalizedSearch = removeVietnameseTones(search);
            if (normalizedValue.includes(normalizedSearch)) return 1;
            return 0;
          }}
        >
          <CommandInput placeholder="Tìm kiếm..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy dữ liệu.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.id}
                  value={`${opt.name} ${opt.code}`.toLowerCase()}
                  onSelect={() => {
                    onChange(opt.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === opt.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{opt.name}</span>
                    {opt.code && (
                      <span className="text-xs text-slate-400">
                        Mã: {opt.code}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectBoxSuggest;
