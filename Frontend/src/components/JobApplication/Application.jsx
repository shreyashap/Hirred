import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BarLoader } from "react-spinners";
import { useState } from "react";
import { applyToJob } from "../../api/applyJob";
import { toast, Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";

const schema = z.object({
  applicantFullName: z.string().min(1, { message: "Full Name is required" }),
  applicantEmail: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  mobileNo: z
    .string()
    .min(1, { message: "Mobile number is required" })
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message: "Please enter a valid mobile number",
    }),
  resume: z
    .any()
    .refine(
      (file) =>
        file &&
        (file.type === "application/pdf" || file.type === "application/msword"),
      { message: "Only PDF or Word documents are allowed" }
    ),
  coverLetter: z.string().optional(),
});

function ApplyJobDrawer({ isOpen, setIsDrawerOpen, setIsApplied }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("fullName", data.applicantFullName);
    formData.append("email", data.applicantEmail);
    formData.append("mobileNo", data.mobileNo);
    formData.append("resume", data.resume);
    formData.append("coverLetter", data.coverLetter);

    const { data: result, error } = await applyToJob(formData, id, setLoading);
    if (result) {
      console.log(data);
      setIsApplied(true);
      toast.success("Applied Successfully");
    }

    if (error) {
      if (error.data.errorMsg) {
        toast.error(error.data.errorMsg);
      }
      console.error(error);
    }
    reset();
  };

  return (
    <>
      <Drawer open={isOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Apply for</DrawerTitle>
            <DrawerDescription>Please Fill the form below</DrawerDescription>
          </DrawerHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-4 pb-0"
          >
            <Input
              type="text"
              placeholder="Full Name"
              className="flex-1"
              {...register("applicantFullName")}
            />
            {errors.applicantFullName && (
              <p className="text-red-500">{errors.applicantFullName.message}</p>
            )}

            <Input
              type="email"
              placeholder="Email Address"
              className="flex-1"
              {...register("applicantEmail")}
            />
            {errors.applicantEmail && (
              <p className="text-red-500">{errors.applicantEmail.message}</p>
            )}

            <Input
              type="text"
              placeholder="Mobile Number"
              className="flex-1"
              {...register("mobileNo")}
            />
            {errors.mobileNo && (
              <p className="text-red-500">{errors.mobileNo.message}</p>
            )}

            <Controller
              name="resume"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <Input
                  type="file"
                  accept=".pdf, .doc, .docx"
                  className="flex-1 file:text-gray-500"
                  onChange={(e) => {
                    const files = e.target.files;
                    console.log(files);
                    if (files && files.length > 0) {
                      field.onChange(files[0]);
                    }
                  }}
                />
              )}
            />
            {errors.resume && (
              <p className="text-red-500">{errors.resume.message}</p>
            )}

            <Textarea
              placeholder="Cover Letter"
              className="flex-1"
              {...register("coverLetter")}
            />
            {errors.coverLetter && (
              <p className="text-red-500">{errors.coverLetter.message}</p>
            )}

            {loading && <BarLoader width={"100%"} color="#36d7b7" />}

            <Button type="submit" variant="blue" size="lg" disabled={loading}>
              Apply
            </Button>
          </form>

          <DrawerFooter>
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Toaster />
    </>
  );
}

export default ApplyJobDrawer;
