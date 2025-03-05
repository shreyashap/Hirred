import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "react-hot-toast";
import { forgetPassword } from "@/api/user";

function ForgetPassword() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState();

  const schema = z.object({
    email: z
      .string()
      .min(1, { message: "Email address is required" })
      .email({ message: "Invalid email address" }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (d) => {
    const { data, error } = await forgetPassword(d, setLoading);

    if (data) {
      toast.success("Password reset link sent to your email", {
        position: "top-right",
      });
    }

    if (error) {
      setServerError(error.errorMsg);
    }
    reset();
  };

  return (
    <>
      <div className="flex justify-center items-center my-10 p-4">
        <div className="bg-[#212f3dc9] bg-opacity-90 rounded-lg p-8 w-full max-w-md mt-14">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-100">
            Forget Password
          </h2>
          <p className="text-center my-4 text-gray-300">
            Request your password reset
          </p>
          <hr className="border-white" />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6 mt-4">
              <Label className="my-4 ml-2 text-md">Email</Label>
              <Input
                type="email"
                placeholder="Enter your email..."
                {...register("email")}
                className="mt-4"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 ml-2 my-4 -mt-2">
                {errors.email.message}
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
                "Submit"
              )}
            </Button>
          </form>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default ForgetPassword;
