import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { updateCompanyDetails } from "../../api/companyApi";
import { toast, Toaster } from "react-hot-toast";
import { IoIosClose } from "react-icons/io";
import { editCompanySchema } from "../../schemas/companySchema";

const EditCompany = ({ companyDetails, setIsModalOpen }) => {
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editCompanySchema),
    defaultValues: {
      companyName: companyDetails.companyName || "",
      description: companyDetails.companyDescription || "",
      location: companyDetails.location || "",
      website: companyDetails.website || "",
      logo: null,
    },
  });

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("companyName", data.companyName);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("website", data.website);

    if (data.logo) {
      formData.append("logo", data.logo);
    }

    const { data: updatedCompany, error } = await updateCompanyDetails(
      companyDetails._id,
      formData,
      setLoading
    );

    if (updatedCompany) {
      toast.success("Company details updated successfully!");
      setIsModalOpen(false);
    }

    if (error) {
      if (error.data.errorMsg) {
        toast.error(error.data.errorMsg);
      } else {
        toast.error("Failed to update company details. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="absolute top-24 left-0 backdrop-blur w-full bg-transparent  p-6">
        <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-md">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold mb-4">
              Edit Company Details
            </h1>
            <IoIosClose
              className="text-white text-3xl cursor-pointer hover:text-gray-300"
              onClick={closeModal}
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Company Name */}
            <div className="mb-4">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                {...register("companyName")}
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <p className="text-sm text-red-500">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe the company"
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="mb-4">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                {...register("location")}
                placeholder="City, Country"
              />
              {errors.location && (
                <p className="text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Website */}
            <div className="mb-4">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                {...register("website")}
                placeholder="https://example.com"
              />
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website.message}</p>
              )}
            </div>

            {/* Logo */}
            <div className="mb-4">
              <Label htmlFor="logo">Logo</Label>
              <Controller
                name="logo"
                control={control}
                render={({ field }) => (
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                      if (file) {
                        setLogoPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                )}
              />
              {errors.logo && (
                <p className="text-sm text-red-500">{errors.logo.message}</p>
              )}
              {logoPreview && (
                <div className="mt-4">
                  <Label>Logo Preview</Label>
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-20 h-20 mt-2 rounded-md object-cover"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="blue"
              size="lg"
              className="mt-2 w-full"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Company"}
            </Button>
          </form>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default EditCompany;
