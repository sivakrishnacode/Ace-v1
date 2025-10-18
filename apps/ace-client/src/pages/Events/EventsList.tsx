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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EventsList() {
  const [position, setPosition] = useState("Newest");

  const navigate = useNavigate();

  const handleAddEvent = () => navigate("/events/create");

  return (
    <div>
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
