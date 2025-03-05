import { z } from "zod";

export const userRegisteartionSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  mobileNo: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid mobile number"),
  country: z.string().min(1, { message: "Country is required" }),
  bio: z
    .string()
    .min(10, { message: "Bio should contain at least 10 characters" })
    .max(1000, {
      message: "Bio should not exceed more than 1000 characters",
    })
    .optional(),
});

export const userLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

export const forgetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const updatePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
