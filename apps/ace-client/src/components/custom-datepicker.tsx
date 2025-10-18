"use client";

import * as React from "react";
import { CalendarIcon, X as XIcon } from "lucide-react";
import { addDays, endOfMonth, startOfMonth } from "date-fns";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function fmt(d?: Date) {
  if (!d) return "";
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// --- MULTI DAY RANGE PICKER ---
export function CalendarRange({
  value,
  onChange,
}: {
  value?: DateRange;
  onChange: (r?: DateRange) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(value?.from ?? new Date());

  const label =
    value?.from && value?.to
      ? `${fmt(value.from)} — ${fmt(value.to)}`
      : value?.from
        ? `${fmt(value.from)} — …`
        : "Select date range";

  return (
    <div className="grid gap-2">
      <Label>
        Event Period<span className="text-destructive">*</span>
      </Label>
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
          onClick={() => setOpen(true)}
        >
          {label}
          <CalendarIcon className="h-4 w-4 opacity-70" />
        </Button>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <span />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={value}
              onSelect={(r) => {
                onChange(r);
                if (r?.from && r?.to) setOpen(false);
              }}
              month={month}
              onMonthChange={setMonth}
              defaultMonth={value?.from ?? new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export function SingleDayPicker({
  value,
  onChange,
}: {
  value?: Date;
  onChange: (d: Date) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(value ?? new Date());

  return (
    <div className="grid gap-2">
      <Label>
        Event Date<span className="text-destructive">*</span>
      </Label>
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
          onClick={() => setOpen(true)}
        >
          {fmt(value)}
          <CalendarIcon className="h-4 w-4 opacity-70" />
        </Button>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <span />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={(d) => {
                if (d) {
                  onChange(d);
                  setOpen(false);
                }
              }}
              month={month}
              onMonthChange={setMonth}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
