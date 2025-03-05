import { z } from "zod";

export const jobSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),

  description: z.string().min(1, { message: "Description is required" }),
  jobLocation: z
    .string()
    .min(2, { message: "Location must be at least 2 characters long" })
    .max(100, { message: "Location must be at most 100 characters long" }),

  jobType: z.enum(["Remote", "In-Office", "Hybrid"]),
  employmentType: z.enum(["Full-Time", "Part-Time", "Contract", "Internship"]),
});
