import { z } from "zod";

export const jobApplicationSchema = z.object({
  fullName: z.string().min(4, { message: "Full Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  mobileNo: z
    .string()
    .min(1, { message: "Mobile number is required" })
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message: "Please enter a valid mobile number",
    }),
  coverLetter: z.string().optional(),
});
