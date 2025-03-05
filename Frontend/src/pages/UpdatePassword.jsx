import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { updatePassword } from "@/api/user";
import { useParams } from "react-router-dom";

function UpdatePassword() {
  const [loading, setLoading] = useState();
  const [serverError, setServerError] = useState();
  const { id } = useParams();

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  const schema = z.object({
    newPassword: z
      .string()
      .min(1, {
        message: "New password is required",
      })
      .regex(passwordRegex, {
        message:
          "Password must be at least 8 characters long, contains an uppercase letter, a lowercase letter, a number, and a special character.",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" })
      .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords must match.",
        path: ["confirmPassword"],
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (d) => {
    const { data, error } = await updatePassword(d, id, setLoading);

    if (data) {
      console.log(data);
      toast.success("Password reset successfull", {
        position: "top-right",
      });
    }

    if (error) {
      setServerError(error);
    }
  };

  return (
    <div className="flex justify-center items-center my-10 p-4">
      <div className="bg-[#212f3dc9] bg-opacity-90 rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-100">
          Password Reset
        </h2>
        <p className="text-center my-4 text-gray-300">Reset your password</p>
        <hr className="border-white" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 mt-4">
            <Label className="my-4 ml-2 text-md">New Password</Label>
            <Input
              type="password"
              placeholder="Enter your new password..."
              {...register("newPassword")}
              className="mt-4"
            />
          </div>
          {errors.newPassword && (
            <p className="text-red-500 ml-2 my-4 -mt-2">
              {errors.newPassword.message}
            </p>
          )}
          <div className="mb-6 mt-4">
            <Label className="my-4 ml-2 text-md">Confirm Password</Label>
            <Input
              type="password"
              placeholder="Enter your confirm password..."
              {...register("confirmPassword")}
              className="mt-4"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 ml-2 my-4 -mt-2">
              {errors.confirmPassword.message}
            </p>
          )}

          {serverError && (
            <p className="text-red-500 my-4 ml-2">{serverError}</p>
          )}

          <Button
            className="w-full px-4 py-2"
            variant="blue"
            disabled={loading}
          >
            {loading ? (
              <div className="w-6 h-6 rounded-full loader"></div>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
        <Toaster />
      </div>
    </div>
  );
}

export default UpdatePassword;
