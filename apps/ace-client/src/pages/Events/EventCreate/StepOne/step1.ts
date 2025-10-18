/* =========================================================
 * STEP 1 — Basics (title, category, mode, description, tags)
 * ========================================================= */

import z from "zod";

export const Step1Schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.enum(["Education", "Entertainment", "Sports", "Networking"], {
    error: () => ({ message: "Choose a category" }),
  }),
  mode: z.enum(["Online", "Offline", "Hybrid"], {
    error: () => ({ message: "Select a mode" }),
  }),
  description: z.string().min(20, "Write at least 20 characters"),
  tags: z.array(z.string()).optional(),
});

export type Step1Values = z.infer<typeof Step1Schema>;
