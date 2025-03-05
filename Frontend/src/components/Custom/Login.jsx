import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/features/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/user";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (d) => {
    const { data, error } = await login(
      {
        email: d.email,
        password: d.password,
      },
      setLoading
    );

    if (data) {
      const user = data.loggedInUser;
      if (user) dispatch(loginUser(user));

      toast.success(data.message);
      setTimeout(() => {
        if (user.accountType === "recruiter") {
          navigate("/post-job");
        } else if (user.accountType === "applicant") {
          navigate("/jobs");
        }
      }, 1500);
      setServerError("");
    }

    if (error) {
      setServerError(error);
    }
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
        <div className="mb-6 mt-4">
          <Label className="my-4 ml-2">Email</Label>
          <Input type="email" placeholder="Email" {...register("email")} />
        </div>
        {errors.email && (
          <p className="text-red-500 ml-2 my-4 -mt-2">{errors.email.message}</p>
        )}

        <div className="mb-6">
          <Label className="my-4 ml-2">Password</Label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="text-red-500 ml-2 my-4 -mt-2">
            {errors.password.message}
          </p>
        )}

        {serverError && <p className="text-red-500 my-4 ml-2">{serverError}</p>}

        <Button className="w-full px-4 py-2" variant="blue" disabled={loading}>
          {loading ? (
            <div className="w-6 h-6 rounded-full loader"></div>
          ) : (
            "Login"
          )}
        </Button>
      </form>
      <Toaster />
    </>
  );
};

export default Login;
