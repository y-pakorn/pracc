import { memo, useState } from "react"
import { CheckIcon, LucideProps, Plus } from "lucide-react"

import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export const MultiSelectFilterCombobox = memo(
  ({
    options,
    value,
    onChange,
    label,
    icon: Icon,
  }: {
    options: { label: string; value: string }[]
    value: string[]
    onChange: (value: string[]) => void
    label: string
    icon: React.ElementType<LucideProps>
  }) => {
    const [open, setOpen] = useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="xs">
            <Icon />
            {label}
            {!value.length ? (
              <Plus />
            ) : (
              <>
                {": "}
                <span className="text-secondary-foreground">
                  {value
                    .slice(0, 2)
                    .map((v) => options.find((o) => o.value === v)?.label)
                    .join(", ")}
                </span>
                {value.length > 2 && <span>+{value.length - 2}</span>}
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>Not found.</CommandEmpty>
              <CommandGroup>
                {options.map((framework) => {
                  const isSelected = value.includes(framework.value)
                  return (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        onChange(
                          isSelected
                            ? value.filter((v) => v !== currentValue)
                            : [...value, currentValue]
                        )
                      }}
                    >
                      <Checkbox
                        checked={isSelected}
                        aria-readonly
                        className="pointer-events-none size-3.5"
                      />
                      {framework.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
              {value.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      className="justify-center border"
                      onSelect={() => onChange([])}
                    >
                      Clear All Filter
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

MultiSelectFilterCombobox.displayName = "MultiSelectFilterCombobox"
