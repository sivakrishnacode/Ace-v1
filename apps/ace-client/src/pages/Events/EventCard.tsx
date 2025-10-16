"use client";

import * as React from "react";
import {
  IconCalendar,
  IconCurrencyRupee,
  IconStar,
  IconStarFilled,
  IconArchive,
  IconSettings,
} from "@tabler/icons-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ID = string | number;

type EventCardProps = {
  id: ID;
  imageUrl: string;
  eventName: string;
  startDate: string | Date;
  price: number | string; // pass number (INR) or label like "Free"
  rating?: number; // 0..5 (supports halves like 4.5)
  onArchive?: (id: ID) => void;
  onManage?: (id: ID) => void;
  className?: string;
};

function formatDate(d: string | Date) {
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function RatingStars({ value = 0 }: { value?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const total = 5;
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`Rating ${value} out of 5`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const state = i < full ? "full" : i === full && half ? "half" : "empty";
        return (
          <span key={i} className="inline-grid place-items-center">
            {state === "full" && (
              <IconStarFilled className="h-4 w-4" aria-hidden />
            )}
            {state === "half" && (
              <IconStarFilled
                className="h-4 w-4 [--g:linear-gradient(90deg,currentColor_0_50%,transparent_50%_100%)] [background:var(--g)] [mask:linear-gradient(#000_0_0)]"
                aria-hidden
              />
            )}
            {state === "empty" && <IconStar className="h-4 w-4" aria-hidden />}
          </span>
        );
      })}
      <span className="ml-1 text-xs tabular-nums text-muted-foreground">
        {value?.toFixed(1)}
      </span>
    </div>
  );
}

export function EventCard({
  id,
  imageUrl,
  eventName,
  startDate,
  price,
  rating = 0,
  onArchive,
  onManage,
  className,
}: EventCardProps) {
  const handleArchive = React.useCallback(
    () => onArchive?.(id),
    [onArchive, id]
  );
  const handleManage = React.useCallback(() => onManage?.(id), [onManage, id]);

  const isFree = String(price).toLowerCase() === "free" || Number(price) === 0;

  return (
    <Card
      className={[
        "group relative overflow-hidden border bg-card transition",
        "hover:shadow-lg focus-within:shadow-lg",
        "rounded-2xl",
        className ?? "",
      ].join(" ")}
      role="article"
      aria-label={eventName}
    >
      {/* Media */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt="Event banner"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {/* Top gradient & rating */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {rating > 0 && (
            <div className="rounded-full bg-background/90 px-2 py-1 text-xs shadow backdrop-blur">
              <RatingStars value={rating} />
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <CardContent className="grid gap-3 p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-tight">
          {eventName}
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <IconCalendar className="h-4 w-4" aria-hidden />
            <span className="tabular-nums">{formatDate(startDate)}</span>
          </div>
          <div className="inline-flex items-center gap-1 font-medium">
            {!isFree && <IconCurrencyRupee className="h-4 w-4" aria-hidden />}
            <span className={isFree ? "text-emerald-600" : ""}>
              {isFree
                ? "Free"
                : new Intl.NumberFormat(undefined, {
                    maximumFractionDigits: 0,
                  }).format(Number(price))}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 p-4 pt-0">
        <Button
          variant="outline"
          className="rounded-full"
          onClick={handleArchive}
          aria-label="Archive event"
        >
          <IconArchive className="mr-2 h-4 w-4" /> Archive
        </Button>
        <Button
          className="rounded-full"
          onClick={handleManage}
          aria-label="Manage event"
        >
          <IconSettings className="mr-2 h-4 w-4" /> Manage
        </Button>
      </CardFooter>
    </Card>
  );
}

// --- Demo: remove or adapt in your app ---
export default function DemoEventCardGrid() {
  const [archived, setArchived] = React.useState<ID[]>([]);

  const demoEvents = [
    {
      id: 1,
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyvetnLOz5AF4JPJGxqw0EJpwpBHl9swwqww&s",
      eventName: "Hackathon 360° 2.0 — Build AI Tools that Matter",
      startDate: "2025-11-15",
      price: 499,
      rating: 5,
    },
    {
      id: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
      eventName: "STTP: Generative AI for Research Writing",
      startDate: "2025-10-28",
      price: "Free",
      rating: 3,
    },
    {
      id: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop",
      eventName: "Founder Networking Night — Coimbatore",
      startDate: "2025-12-05",
      price: 0,
      rating: 4,
    },
    {
      id: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
      eventName: "Founder Networking Night — Coimbatore",
      startDate: "2025-12-05",
      price: 0,
      rating: 4,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {demoEvents
        .filter((e) => !archived.includes(e.id))
        .map((e) => (
          <EventCard
            key={e.id}
            {...e}
            onArchive={(id) => setArchived((a) => [...a, id])}
            onManage={(id) => alert(`Manage event ${id}`)}
          />
        ))}
    </div>
  );
}
