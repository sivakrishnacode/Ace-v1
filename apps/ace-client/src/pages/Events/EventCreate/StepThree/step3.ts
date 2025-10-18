/* =========================================================
 * STEP 3 — Media (images & links are optional)
 * ========================================================= */

import z from "zod";
import { emptyToUndefined } from "../Steptwo/step2";

export const Step3Schema = z.object({
  // optional URLs; empty strings become undefined
  thumbnailUrl: emptyToUndefined.pipe(z.string().url().optional()),
  bannerUrl: emptyToUndefined.pipe(z.string().url().optional()),
  videoUrl: emptyToUndefined.pipe(z.string().url().optional()),
  galleryUrls: z
    .array(emptyToUndefined.pipe(z.string().url()))
    .optional()
    .default([]),
  agree: z.boolean().default(false),
});

export type Step3Values = z.infer<typeof Step3Schema>;
