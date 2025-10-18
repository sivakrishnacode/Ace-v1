import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defineStepper } from "@stepperize/react";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import type { Resolver } from "react-hook-form";
import { EventCreateOne, EventCreateThree } from "./EventCreateSteps";
import {
  eachDate,
  hasOverlaps,
  isHHMM,
  toMinutes,
  type Period,
  type PeriodsByDate,
} from "./utils";
import { EventCreateTwo } from "./EventCreateStepTwo";
import { currentDateISO, nextDateISO } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// Stepper
// ─────────────────────────────────────────────────────────────
const stepper = defineStepper(
  { id: "step-1", title: "Event Info" },
  { id: "step-2", title: "Schedule & Pricing" },
  { id: "step-3", title: "Review & Publish" }
);

// ─────────────────────────────────────────────────────────────
// Zod Schema (no legacy single-slot fields)
// ─────────────────────────────────────────────────────────────
const zTime = z.string().refine(isHHMM, "Use HH:MM (24h)");

const zPeriod = z
  .object({
    startTime: zTime,
    endTime: zTime,
    type: z.string().max(64).optional().nullable(),
  })
  .refine((p) => toMinutes(p.endTime) > toMinutes(p.startTime), {
    message: "End time must be after start time",
    path: ["endTime"],
  });

const zPeriodsByDate = z.record(
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  z.array(zPeriod).min(1, "Add at least one period for this day")
);

export const formSchema = z
  .object({
    // core
    title: z.string().min(3, "Title must be at least 3 characters"),
    category: z.enum(["Education", "Entertainment", "Sports", "Networking"], {
      error: () => ({ message: "Choose a category" }),
    }),
    mode: z.enum(["Online", "Offline", "Hybrid"], {
      error: () => ({ message: "Select a mode" }),
    }),
    description: z.string().min(20, "Write at least 20 characters"),
    tags: z.array(z.string()).optional(),

    // dates
    startDate: z.coerce.date({
      error: () => ({ message: "Enter a valid start date" }),
    }),
    endDate: z.coerce.date({
      error: () => ({ message: "Enter a valid end date" }),
    }),

    // pricing
    currency: z.enum(["INR", "USD", "EUR"]).default("INR"),
    price: z.coerce
      .number({ error: "Enter a valid amount" })
      .nonnegative("Amount cannot be negative")
      .max(99999999, "Amount too large")
      .multipleOf(0.01, "Use at most 2 decimals"),

    agree: z.literal(true),

    // multi-day schedule
    sameTimeForAllDates: z.boolean().default(false),
    defaultPeriods: z.array(zPeriod).default([]),
    periodsByDate: zPeriodsByDate.default({}),
  })

  .superRefine((data, ctx) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Enter valid dates",
      });
      return;
    }
    if (end < start) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End must be after start",
      });
    }

    const days = eachDate(start, end);

    if (data.sameTimeForAllDates) {
      if (data.defaultPeriods.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["defaultPeriods"],
          message: "Add at least one period",
        });
      }
      if (hasOverlaps(data.defaultPeriods)) {
        ctx.addIssue({
          code: "custom",
          path: ["defaultPeriods"],
          message: "Periods overlap — fix timings",
        });
      }
    } else {
      const keys = Object.keys(data.periodsByDate);
      const missing = days.filter((d) => !(d in data.periodsByDate));
      if (missing.length > 0) {
        ctx.addIssue({
          code: "custom",
          path: ["periodsByDate"],
          message: `Add periods for all days: missing ${missing.join(", ")}`,
        });
      }
      const extras = keys.filter((k) => !days.includes(k));
      if (extras.length > 0) {
        ctx.addIssue({
          code: "custom",
          path: ["periodsByDate"],
          message: `Remove dates outside range: ${extras.join(", ")}`,
        });
      }
      for (const d of keys) {
        if (hasOverlaps(data.periodsByDate[d] ?? [])) {
          ctx.addIssue({
            code: "custom",
            path: ["periodsByDate", d],
            message: "Periods overlap — fix timings",
          });
        }
      }
    }
  });

export type UIFormValues = z.infer<typeof formSchema>;

// seed (your JSON)
const defaultJson = {
  startDate: currentDateISO(),
  endDate: nextDateISO(),
  sameTimeForAllDates: true,
  defaultPeriods: [] as Period[],
  periodsByDate: {} as PeriodsByDate,
};

export type FormValues = z.output<typeof formSchema>;

export default function EventCreateMultiStep() {
  const steps = stepper.useStepper({ initialStep: "step-1" });

  const resolver = zodResolver(formSchema) as Resolver<FormValues>;

  const form = useForm<UIFormValues>({
    resolver,
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      title: "sdafdsfdf",
      category: undefined as unknown as UIFormValues["category"],
      mode: undefined as unknown as UIFormValues["mode"],
      description: "dsfsdfdsfdsfdsfdsfsdfsdf",
      tags: [],

      startDate: new Date(defaultJson.startDate),
      endDate: new Date(defaultJson.endDate),
      sameTimeForAllDates: defaultJson.sameTimeForAllDates,
      defaultPeriods: defaultJson.defaultPeriods,
      periodsByDate: defaultJson.periodsByDate,

      currency: "INR",
      price: 0,
      agree: true,
    },
  });

  const onSubmit = (values: UIFormValues) => {
    console.log("Submitting:", values);
    alert("Event created! Check console for payload.");
  };

  const stepFields: Record<string, (keyof UIFormValues)[]> = {
    "step-1": ["title", "category", "mode", "description", "tags"],
    "step-2": [
      "startDate",
      "endDate",
      "sameTimeForAllDates",
      "defaultPeriods",
      "periodsByDate",
      "currency",
      "price",
    ],
    "step-3": ["agree"],
  };

  const handleNext = async () => {
    const fields = stepFields[steps.current.id] ?? [];
    console.log(fields);

    const valid = await form.trigger(fields as any);

    if (!valid) {
      return;
    }
    if (steps.isLast) {
      await form.handleSubmit(onSubmit)();
    } else {
      steps.next();
    }
  };

  const handleBack = () => !steps.isFirst && steps.prev();

  const progress =
    steps.current.id === "step-1"
      ? 33.3
      : steps.current.id === "step-2"
        ? 66.6
        : 100;

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Create Event</CardTitle>
        <div className="mt-2 h-2 w-full overflow-hidden rounded bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {steps.switch({
                "step-1": () => EventCreateOne(form),
                "step-2": () => EventCreateTwo(form),
                "step-3": () => EventCreateThree(form, form.watch()),
              })}

              <div className="flex items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={steps.isFirst}
                >
                  Back
                </Button>
                <Button type="button" onClick={handleNext}>
                  {steps.isLast ? "Submit" : "Next"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </Form>
      </CardContent>

      <CardContent>
        <pre className="whitespace-pre-wrap">
          {Object.entries(form.watch())
            .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
            .join("\n")}

          {Object.entries(form.formState.errors)
            .map(([k, v]) => `\nError - ${k}: ${JSON.stringify(v)}`)
            .join("\n")}
        </pre>
      </CardContent>
    </Card>
  );
}
