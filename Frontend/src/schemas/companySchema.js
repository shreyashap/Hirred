import { z } from "zod";

export const postJobSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  description: z.string().min(1, { message: "Description is required" }),
  company: z.string().min(1, { message: "Company is required" }),

  jobType: z.enum(["Remote", "In-Office", "Hybrid"]),
  employmentType: z.enum(["Full-Time", "Part-Time", "Contract", "Internship"]),
});

export const editCompanySchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .optional(),
  location: z.string().min(1, { message: "Location is required" }),
  website: z.string().url("Please enter a valid URL"),
  logo: z
    .any()
    .refine((file) => file instanceof File || file === null, "Invalid file."),
});

export const companySchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters."),
  companyLogo: z
    .any()
    .refine((file) => file instanceof File || file === null, "Invalid file."),
  companyDescription: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .optional(),
  location: z.string().min(1, { message: "Location is required" }),
  website: z.string().url({ message: "Link is not valid" }),
});
