import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMultiStepForm } from "../Schemas";

function toCurrency(amount: number | string, currency: string) {
  const n = Number(amount || 0);
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

function EventSummery() {
  const form = useMultiStepForm();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border p-4">
          <h4 className="text-sm font-semibold">Event Summary</h4>
          <dl className="grid grid-cols-3 gap-2 text-sm">
            <dt className="text-muted-foreground">Title</dt>
            <dd className="col-span-2 break-words">
              {form.watch().title || "—"}
            </dd>
            <dt className="text-muted-foreground">Category</dt>
            <dd className="col-span-2">{form.watch().category || "—"}</dd>
            <dt className="text-muted-foreground">Mode</dt>
            <dd className="col-span-2">{form.watch().mode || "—"}</dd>
            <dt className="text-muted-foreground">Price</dt>
            <dd className="col-span-2">
              {toCurrency(
                Number(form.watch().price),
                form.watch().currency || ""
              )}
            </dd>
          </dl>
        </div>
        <div className="space-y-2 rounded-lg border p-4">
          <h4 className="text-sm font-semibold">Schedule</h4>
          <p className="text-sm">
            <span className="text-muted-foreground">Start:</span>{" "}
            {(form.watch().startDate || "—").toString()}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">End:</span>{" "}
            {(form.watch().endDate || "—")?.toString()}
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h4 className="text-sm font-semibold">Description</h4>
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
          {form.watch().description || "—"}
        </p>
      </div>

      <FormField
        control={form.control}
        name="agree"
        render={({ field }) => (
          <FormItem className="flex items-start gap-3">
            <FormControl>
              <Checkbox
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I confirm the details are correct and agree to publish this
                event.
              </FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export { EventSummery };
