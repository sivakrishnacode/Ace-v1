/* =========================================================
 * STEP 2 — Dates & Times (pricing included if you want)
 * ========================================================= */

import z from "zod";

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export const zPeriod = z.object({
  startTime: z.string().regex(HHMM, "Use HH:MM"),
  endTime: z.string().regex(HHMM, "Use HH:MM"),
  type: z.string().optional().default(""),
});

export const zPeriodsByDate = z.record(z.string(), z.array(zPeriod));

// local-only date utils (avoid UTC shift)
const fmtLocalYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export function eachDateLocal(start: Date, end: Date) {
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const out: string[] = [];
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    out.push(fmtLocalYMD(d));
  }
  return out;
}

export const emptyToUndefined = z
  .string()
  .transform((s) => (s?.trim() === "" ? undefined : s?.trim()));

export function hasOverlaps(
  periods: { startTime: string; endTime: string }[]
): boolean {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const norm = periods
    .map((p) => ({ s: toMin(p.startTime), e: toMin(p.endTime) }))
    .filter((p) => p.s < p.e)
    .sort((a, b) => a.s - b.s);

  for (let i = 1; i < norm.length; i++) {
    if (norm[i].s < norm[i - 1].e) return true;
  }
  return false;
}

export const Step2Schema = z
  .object({
    startDate: z.coerce.date({
      error: () => ({ message: "Enter a valid start date" }),
    }),
    endDate: z.coerce.date({
      error: () => ({ message: "Enter a valid end date" }),
    }),

    currency: z.enum(["INR", "USD", "EUR"]).default("INR"),
    price: z.coerce
      .number({ error: () => ({ message: "Enter a valid amount" }) })
      .nonnegative("Amount cannot be negative")
      .max(99_999_999, "Amount too large")
      .multipleOf(0.01, "Use at most 2 decimals"),

    sameTimeForAllDates: z.boolean().default(false),
    defaultPeriods: z.array(zPeriod).default([]),
    periodsByDate: zPeriodsByDate.default({}),
  })
  .superRefine((data, ctx) => {
    const start = new Date(
      data.startDate.getFullYear(),
      data.startDate.getMonth(),
      data.startDate.getDate()
    );
    const end = new Date(
      data.endDate.getFullYear(),
      data.endDate.getMonth(),
      data.endDate.getDate()
    );

    if (end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End must be after start",
      });
      return;
    }

    // build in-range date keys
    const days = eachDateLocal(start, end);

    if (data.sameTimeForAllDates) {
      if (!data.defaultPeriods.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["defaultPeriods"],
          message: "Add at least one period",
        });
      }
      if (hasOverlaps(data.defaultPeriods)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["defaultPeriods"],
          message: "Periods overlap — fix timings",
        });
      }
      // do NOT enforce periodsByDate in this mode
      return;
    }

    // per-day mode
    const keys = Object.keys(data.periodsByDate ?? {});
    const missing = days.filter((d) => !(d in data.periodsByDate));
    if (missing.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["periodsByDate"],
        message: `Add periods for all days: missing ${missing.join(", ")}`,
      });
    }
    const extras = keys.filter((k) => !days.includes(k));
    if (extras.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["periodsByDate"],
        message: `Remove dates outside range: ${extras.join(", ")}`,
      });
    }
    for (const d of keys) {
      const arr = data.periodsByDate[d] ?? [];
      if (!arr.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["periodsByDate", d],
          message: "Add at least one period for this day",
        });
      } else if (hasOverlaps(arr)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["periodsByDate", d],
          message: "Periods overlap — fix timings",
        });
      }
    }
  });

export type Step2Values = z.infer<typeof Step2Schema>;
