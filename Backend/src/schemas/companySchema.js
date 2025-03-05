import { z } from "zod";

export const companySchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters."),
  companyDescription: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .optional(),
  location: z.string().min(1, { message: "Location is required" }),
  website: z.string().min(1, { message: "Website is required" }),
});
