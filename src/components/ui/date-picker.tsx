import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { m } from "@/paraglide/messages";

export function DatePicker({
    date,
    onChange,
    className,
}: {
    date: Date | undefined;
    onChange: (date: Date) => void;
    className?: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        `w-[240px] justify-start text-left font-normal`,
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date
                        ? format(date, "yyyy/MM/dd")
                        : m["common.pick a date"]()}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    defaultMonth={date}
                    onSelect={(selectedDate) => {
                        if (selectedDate) {
                            onChange(selectedDate);
                            setOpen(false);
                        }
                    }}
                    captionLayout="dropdown"
                />
            </PopoverContent>
        </Popover>
    );
}
