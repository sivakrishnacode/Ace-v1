import { FormProvider } from "react-hook-form";
import { defineStepper } from "@stepperize/react";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import { EventCreateTwo } from "./Steptwo/EventCreate.STwo";
import { EventCreateOne } from "./StepOne/EventCreateStepOne";
import EventCreateThree from "./StepThree/EventCreate.SThree";
import { EventSummery } from "./summery/EventSummery";
import { useMultiStepForm } from "./Schemas";
import type { FullEventValues } from "./Schemas";

// ─────────────────────────────────────────────────────────────
// Stepper
// ─────────────────────────────────────────────────────────────
const stepper = defineStepper(
  { id: "step-1", title: "Event Info" },
  { id: "step-2", title: "Schedule & Pricing" },
  { id: "step-3", title: "Review & Publish" },
  { id: "summery", title: "Summery" }
);

export default function EventCreateMultiStep() {
  const steps = stepper.useStepper({ initialStep: "step-1" });

  const form = useMultiStepForm();

  const onSubmit = (values: FullEventValues) => {
    console.log("Submitting:", values);
    alert("Event created! Check console for payload.");
  };

  const stepFields: Record<string, (keyof FullEventValues)[]> = {
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
                "step-1": () => <EventCreateOne />, // ✅ JSX component
                "step-2": () => <EventCreateTwo />,
                "step-3": () => <EventCreateThree />,
                summery: () => <EventSummery />,
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
                <div className="flex items-center gap-2">
                  <Button
                    variant={"secondary"}
                    onClick={() => {
                      steps.reset(); //
                      form.reset();
                    }}
                  >
                    Reset
                  </Button>
                  <Button type="button" onClick={handleNext}>
                    {steps.isLast ? "Submit" : "Next"}
                  </Button>
                </div>
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
