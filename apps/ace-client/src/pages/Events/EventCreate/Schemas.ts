import { z } from "zod";
import { Step1Schema, type Step1Values } from "./StepOne/step1";
import { Step2Schema, type Step2Values } from "./Steptwo/step2";
import { Step3Schema, type Step3Values } from "./StepThree/step3";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/* =========================================================
 * FULL — Merge all steps (for final submit)
 * ========================================================= */

export const FullEventSchema = Step1Schema.and(Step2Schema) // ✅ preserves Step2 superRefine
  .and(Step3Schema);

export type FullEventValues = z.infer<typeof FullEventSchema>;

export const useMultiStepForm = () => {
  const resolver = zodResolver(FullEventSchema) as Resolver<FullEventValues>;
  return useForm<FullEventValues>({
    resolver,
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: FULL_DEFAULTS,
  });
};

/* -------------------- nice-to-have defaults -------------------- */

export const STEP1_DEFAULTS: Step1Values = {
  title: "",
  category: "Education",
  mode: "Online",
  description: "",
  tags: [],
};

export const STEP2_DEFAULTS: Step2Values = {
  startDate: new Date(),
  endDate: new Date(),
  currency: "INR",
  price: 0,
  sameTimeForAllDates: false,
  defaultPeriods: [],
  periodsByDate: {},
};

export const STEP3_DEFAULTS: Step3Values = {
  thumbnailUrl: "",
  bannerUrl: "",
  videoUrl: "",
  galleryUrls: [],
  agree: false,
};

export const FULL_DEFAULTS: FullEventValues = {
  ...STEP1_DEFAULTS,
  ...STEP2_DEFAULTS,
  ...STEP3_DEFAULTS,
};
