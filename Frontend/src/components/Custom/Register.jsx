import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { bigint, z } from "zod";
import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import { toast, Toaster } from "react-hot-toast";
import { registerUser } from "../../api/user";

const Register = () => {
  const [accountType, setAccountType] = useState("");
  const [loading, setLoading] = useState(false);

  const [serverError, setServerError] = useState();

  const location = useLocation();
  const { pathname } = location;
  const account = pathname.includes("recruiter");

  useEffect(() => {
    if (pathname.includes("recruiter")) {
      setAccountType("recruiter");
    } else if (pathname.includes("applicant")) {
      setAccountType("applicant");
    }
  }, [pathname]);

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  const schema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(passwordRegex, {
        message:
          "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.",
      }),
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (d) => {
    const { data, error } = await registerUser(
      accountType,
      {
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        password: d.password,
        mobileNo: d.mobileNo,
        country: d.country,
        bio: d.bio,
      },
      setLoading
    );

    if (data) {
      setServerError(null);
      toast.success("User Registeration Successfull. Go to login page", {
        position: "top-right",
      });
    }

    if (error) {
      console.error(error);
      setServerError(error);
    }
    reset();
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-100">
        Sign In To Hirred
      </h2>
      <p className="text-center my-4 text-gray-300">
        Welcome back! Please sign in to continue
      </p>
      <hr className="border-white" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mt-4">
          <div className="mb-6 w-40">
            <Label className="my-4 ml-2">First Name</Label>
            <Input
              type="text"
              placeholder="First Name"
              {...register("firstName")}
            />
          </div>
          <div className="mb-6 w-40">
            <Label className="my-4 ml-2">Last Name</Label>
            <Input
              type="text"
              placeholder="Last Name"
              {...register("lastName")}
            />
          </div>
        </div>
        {errors?.firstName && (
          <p className="text-red-500 ml-2 my-4 -mt-2">
            {errors.firstName.message}
          </p>
        )}
        <div className="mb-6">
          <Label className="my-4 ml-2">Email</Label>
          <Input type="email" placeholder="Email" {...register("email")} />
          {errors?.email && (
            <p className="text-red-500 my-4 ml-2">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <Label className="my-4 ml-2">Password</Label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
          {errors?.password && (
            <p className="text-red-500 ml-2 my-4">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-6">
          <Label className="my-4 ml-2">Mobile No</Label>
          <Input
            type="phone"
            placeholder="123-456-789"
            {...register("mobileNo")}
          />
          {errors?.mobileNo && (
            <p className="text-red-500 ml-2 my-4">{errors.mobileNo.message}</p>
          )}
        </div>

        <div className="mb-6">
          <Label className="my-4 ml-2">Country</Label>
          <Input type="text" placeholder="India" {...register("country")} />
          {errors?.country && (
            <p className="text-red-500 ml-2 my-4">{errors.country.message}</p>
          )}
        </div>

        <div className={`${account && "hidden"} mb-6`}>
          <Label className="my-4 ml-2">Bio</Label>
          <Textarea placeholder="Enter your bio" {...register("bio")} />
          {errors?.bio && (
            <p className="text-red-500 ml-2 my-4">{errors.bio.message}</p>
          )}
        </div>

        {serverError && <p className="text-red-500 ml-2 my-4">{serverError}</p>}

        <Button className="w-full px-4 py-2" variant="blue" disabled={loading}>
          {loading ? <div className="w-6 h-6 loader"></div> : "SignUp"}
        </Button>
      </form>
      <Toaster />
    </>
  );
};

export default Register;
