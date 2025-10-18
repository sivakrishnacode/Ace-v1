import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import RHFTags from "@/components/custom-tags";

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

function EventCreateOne(form: any) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Hackathon 360° 2.0" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Networking">Networking</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mode</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <RHFTags
                value={field.value ?? []}
                onChange={(next) => field.onChange(next)}
                options={
                  [
                    // { id: "featured", label: "Featured" },
                    // { id: "trending", label: "Trending" },
                    // { id: "exclusive", label: "Exclusive" },
                  ]
                }
                maxTags={8}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                rows={6}
                placeholder="What is this event about? Who should join?"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function EventCreateThree(form: any, values: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border p-4">
          <h4 className="text-sm font-semibold">Event Summary</h4>
          <dl className="grid grid-cols-3 gap-2 text-sm">
            <dt className="text-muted-foreground">Title</dt>
            <dd className="col-span-2 break-words">{values.title || "—"}</dd>
            <dt className="text-muted-foreground">Category</dt>
            <dd className="col-span-2">{values.category || "—"}</dd>
            <dt className="text-muted-foreground">Mode</dt>
            <dd className="col-span-2">{values.mode || "—"}</dd>
            <dt className="text-muted-foreground">Price</dt>
            <dd className="col-span-2">
              {toCurrency(Number(values.price), values.currency || "")}
            </dd>
          </dl>
        </div>
        <div className="space-y-2 rounded-lg border p-4">
          <h4 className="text-sm font-semibold">Schedule</h4>
          <p className="text-sm">
            <span className="text-muted-foreground">Start:</span>{" "}
            {(values.startDate || "—").toString()} {values.startTime || ""}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">End:</span>{" "}
            {(values.endDate || "—")?.toString()} {values.endTime || ""}
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h4 className="text-sm font-semibold">Description</h4>
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
          {values.description || "—"}
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

export { EventCreateOne, EventCreateThree };
