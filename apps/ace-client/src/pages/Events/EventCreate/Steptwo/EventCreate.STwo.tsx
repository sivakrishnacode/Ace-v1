import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { eachDate } from "../utils";
import { Badge } from "@/components/ui/badge";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { type FullEventValues } from "../Schemas";

function PeriodListEditor({
  name,
  emptyHint,
}: {
  name: `defaultPeriods` | `periodsByDate.${string}`;
  emptyHint?: string;
}) {
  const form = useFormContext<FullEventValues>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name,
  });

  return (
    <div className="space-y-3">
      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {emptyHint ?? "No periods yet."}
        </p>
      )}

      {fields.map((f, idx) => (
        <div
          key={f.id}
          className="grid grid-cols-1 md:grid-cols-5 items-end gap-3 rounded-lg border p-3"
        >
          <Controller
            name={`${name}.${idx}.startTime` as const}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Label>Start (HH:MM)</Label>

                <Input
                  type="time"
                  id="time-picker"
                  {...field}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                {fieldState.error && (
                  <p className="text-xs text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            name={`${name}.${idx}.endTime` as const}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Label>End (HH:MM)</Label>
                <Input
                  type="time"
                  id="time-picker"
                  {...field}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                {fieldState.error && (
                  <p className="text-xs text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            name={`${name}.${idx}.type` as const}
            render={({ field }) => (
              <div className="space-y-1 md:col-span-2">
                <Label>Type (optional)</Label>
                <Input
                  placeholder="Long Day / Workshop / Keynote…"
                  {...field}
                />
              </div>
            )}
          />
          <div className="flex md:justify-end">
            <Button type="button" variant="outline" onClick={() => remove(idx)}>
              Remove
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          append({ startTime: "09:00", endTime: "11:00", type: "" })
        }
      >
        + Add Period
      </Button>
    </div>
  );
}

function PerDayEditor() {
  const form = useFormContext<FullEventValues>();

  const start = form.watch("startDate");
  const end = form.watch("endDate");

  const days = React.useMemo(() => {
    if (!start || !end) return [];
    try {
      return eachDate(new Date(start), new Date(end));
    } catch {
      return [];
    }
  }, [start, end]);

  // ensure an entry exists in periodsByDate when we render
  React.useEffect(() => {
    const values = form.getValues();
    if (!values || days.length === 0) return;
    const current = { ...(values.periodsByDate || {}) };
    let changed = false;
    for (const d of days) {
      if (!current[d]) {
        current[d] = [];
        changed = true;
      }
    }
    // remove dates outside range from UI model (not required, but keeps tidy)
    Object.keys(current).forEach((k) => {
      if (!days.includes(k)) {
        delete current[k];
        changed = true;
      }
    });
    if (changed)
      form.setValue("periodsByDate", current, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false,
      });
  }, [days]);

  if (days.length === 0) return null;

  return (
    <div className="space-y-6">
      {days.map((d) => (
        <div key={d} className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">{d}</h4>
            <Badge variant="outline">Custom</Badge>
          </div>
          <FormField
            control={form.control}
            name={`periodsByDate.${d}` as const}
            render={() => (
              <FormItem>
                <FormControl>
                  <div>
                    <PeriodListEditor
                      name={`periodsByDate.${d}`}
                      emptyHint="No periods yet for this date."
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
        </div>
      ))}
    </div>
  );
}

export function EventCreateTwo() {
  const form = useFormContext<FullEventValues>();

  return (
    <div className="grid gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={
                    field.value
                      ? new Date(field.value).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={
                    field.value
                      ? new Date(field.value).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-end">
          <FormField
            control={form.control}
            name="sameTimeForAllDates"
            render={({ field }) => (
              <FormItem className="flex w-full items-center justify-between rounded-lg border p-3">
                <div>
                  <FormLabel>Same time every day?</FormLabel>
                  <div className="text-xs text-muted-foreground">
                    Toggle to apply one schedule to all dates
                  </div>
                </div>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      {form?.watch("sameTimeForAllDates") ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Default Periods</h3>
            <Badge variant="outline">All Dates</Badge>
          </div>
          <FormField
            control={form.control}
            name="defaultPeriods"
            render={() => (
              <FormItem>
                <FormControl>
                  <PeriodListEditor
                    name="defaultPeriods"
                    emptyHint="No default periods yet."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Per-day Periods</h3>
          <PerDayEditor />
        </div>
      )}

      {/* <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div> */}
    </div>
  );
}
