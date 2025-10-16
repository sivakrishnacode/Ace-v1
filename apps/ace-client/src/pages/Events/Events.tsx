"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconFilter2, IconPlus } from "@tabler/icons-react";
import DemoEventCardGrid from "./EventCard";

export default function Events() {
  const [position, setPosition] = React.useState("Newest");

  const handleAddEvent = () => {
    // 👉 replace with modal open, route push, or API call
    alert("Add Event Clicked 🚀");
  };

  return (
    <div className="flex flex-col align-middle  py-4  md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        {/* Filter button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <IconFilter2 size={16} />
              {!position ? "Filter" : position}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
            >
              <DropdownMenuRadioItem value="Newest">
                Newest
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Top Rated">
                Top Rated
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Price">Price</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Add Event button */}
        <Button size="sm" className="gap-1" onClick={handleAddEvent}>
          <IconPlus size={16} />
          Add Event
        </Button>
      </div>

      <DemoEventCardGrid />
    </div>
  );
}
