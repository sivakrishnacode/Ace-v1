import React from "react";
import type { FormValues } from "../EventCreate";
import { useFormContext } from "react-hook-form";
import type { FullEventValues } from "../Schemas";

function EventCreateThree() {
  const form = useFormContext<FullEventValues>();

  return <div>four</div>;
}

export default EventCreateThree;
