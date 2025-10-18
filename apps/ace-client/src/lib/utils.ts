import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const currentDateISO = () => new Date().toISOString().split("T")[0];

export const nextDateISO = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

export const YMD = /^\d{4}-\d{2}-\d{2}$/;

export const toUTCms = (v: string | Date) => {
  if (v instanceof Date && !isNaN(v.getTime())) {
    // use *local* parts but compare in UTC to avoid timezone drift
    return Date.UTC(v.getFullYear(), v.getMonth(), v.getDate());
  }
  if (typeof v === "string" && YMD.test(v)) {
    const [y, m, d] = v.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  }
  return NaN;
};

export const ymdFrom = (v: string | Date): string | null => {
  if (typeof v === "string" && YMD.test(v)) return v;
  if (v instanceof Date && !isNaN(v.getTime())) {
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, "0");
    const d = String(v.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return null;
};

export const eachDateYMD = (startYMD: string, endYMD: string) => {
  const [sy, sm, sd] = startYMD.split("-").map(Number);
  const [ey, em, ed] = endYMD.split("-").map(Number);
  const cur = new Date(Date.UTC(sy, sm - 1, sd));
  const end = new Date(Date.UTC(ey, em - 1, ed));
  const out: string[] = [];
  while (cur.getTime() <= end.getTime()) {
    const y = cur.getUTCFullYear();
    const m = String(cur.getUTCMonth() + 1).padStart(2, "0");
    const d = String(cur.getUTCDate()).padStart(2, "0");
    out.push(`${y}-${m}-${d}`);
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
};
