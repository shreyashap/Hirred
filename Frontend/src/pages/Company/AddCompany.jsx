import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { registerCompany } from "../../api/companyApi";

import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { companySchema } from "../../schemas/companySchema";

const RegisterCompany = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const defaultValues = {
    companyName: "",
    companyLogo: null,
    companyDescription: "",
    location: "",
    website: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues,
  });

  const onSubmit = async (data) => {
    const companyData = new FormData();
    companyData.append("companyName", data.companyName);
    companyData.append("companyLogo", data.companyLogo);
    companyData.append("companyDescription", data.companyDescription);
    companyData.append("location", data.location);
    companyData.append("website", data.website);

    const { data: company, error } = await registerCompany(
      companyData,
      setLoading
    );

    if (company) {
      console.log(company);
      toast.success(company?.message, {
        position: "top-right",
      });

      setTimeout(() => {
        navigate("/companies");
      }, 1000);
    }

    if (error) {
      if (error.data?.errorMsg) {
        toast.error(error.data?.errorMsg);
      }
      console.log(error.data);
    }

    reset();
  };

  return (
    <>
      <div className="w-full bg-slate-950 p-6 md:p-0">
        <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-md">
          <h1 className="text-2xl font-semibold mb-4">Register New Company</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Company Name */}
            <div className="mb-4">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                {...register("companyName")}
                placeholder="Enter your company name"
              />
              {errors.companyName && (
                <p className="text-sm text-red-500">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Company Logo */}
            <div className="mb-4">
              <Label htmlFor="companyLogo">Company Logo</Label>
              <Controller
                name="companyLogo"
                control={control}
                render={({ field }) => (
                  <Input
                    id="companyLogo"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      field.onChange(e.target.files?.[0] || null)
                    }
                  />
                )}
              />
              {errors.companyLogo && (
                <p className="text-sm text-red-500">
                  {errors.companyLogo.message}
                </p>
              )}
            </div>

            {/* Company Description */}
            <div className="mb-4">
              <Label htmlFor="companyDescription">Company Description</Label>
              <Textarea
                id="companyDescription"
                {...register("companyDescription")}
                placeholder="Describe your company"
              />
              {errors.companyDescription && (
                <p className="text-sm text-red-500">
                  {errors.companyDescription.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <Label htmlFor="location">Company Location</Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="City, Country"
              />
              {errors.location && (
                <p className="text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <Label htmlFor="website">Company Website</Label>
              <Input
                id="website"
                {...register("website")}
                placeholder="Add your website"
              />
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="blue"
              size="lg"
              className="mt-2 w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="w-7 h-7 rounded-full mx-auto loader disabled:cursor-not-allowed"></div>
              ) : (
                "Register Company"
              )}
            </Button>
          </form>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default RegisterCompany;
