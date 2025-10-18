export type Period = {
  startTime: string;
  endTime: string;
  type?: string | null;
};
export type PeriodsByDate = Record<string, Period[]>;

export const isHHMM = (s: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(s);
export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
export const eachDate = (start: Date, end: Date) => {
  const days: string[] = [];
  const d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (d <= e) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    days.push(`${y}-${m}-${day}`);
    d.setDate(d.getDate() + 1);
  }

  return days;
};

export const hasOverlaps = (periods: Period[]) => {
  const slots = periods
    .map((p) => ({ s: toMinutes(p.startTime), e: toMinutes(p.endTime) }))
    .sort((a, b) => a.s - b.s);
  for (let i = 1; i < slots.length; i++) {
    if (slots[i].s < slots[i - 1].e) return true;
  }
  return false;
};
