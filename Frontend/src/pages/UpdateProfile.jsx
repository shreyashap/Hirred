import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { getUser } from "../api/user";
import { ScaleLoader } from "react-spinners";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateUserDetails } from "../api/user";
import { toast, Toaster } from "react-hot-toast";

const UpdateProfile = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [userSkills, setUserSkills] = useState([]);
  const [updateInfoLoading, setUpdateInfoLoading] = useState(false);

  const { register, handleSubmit, control, setValue, watch, reset } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNo: "",
      country: "",
      skills: "",
      bio: "",
      preferences: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "preferences",
  });

  const watchPreferences = watch("preferences");

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      const { data, error } = await getUser();

      if (data?.user) {
        setUser(data.user);

        setValue("firstName", data.user.firstName || "");
        setValue("lastName", data.user.lastName || "");
        setValue("email", data.user.email || "");
        setValue("mobileNo", data.user.mobileNo || "");
        setValue("country", data.user.country || "");
        setValue("skills", data.user.skills || "");
        setValue("bio", data.user.bio || "");
        setValue("preferences", data.user.preferences || []);

        if (data.user.skills) {
          const userSkills = data.user.skills.split(",");
          setUserSkills(userSkills);
        }
      }

      if (error) console.error(error);

      setLoading(false);
    };
    fetchUserInfo();
  }, [setValue]);

  const onSubmit = async (d) => {
    const { data, error } = await updateUserDetails(d, setUpdateInfoLoading);

    if (data) {
      toast.success("User Details update successfull", {
        position: "top-right",
      });
      setUser(data.user);

      setValue("firstName", data.user.firstName || "");
      setValue("lastName", data.user.lastName || "");
      setValue("email", data.user.email || "");
      setValue("mobileNo", data.user.mobileNo || "");
      setValue("country", data.user.country || "");
      setValue("skills", data.user.skills || "");
      setValue("bio", data.user.bio || "");
      setValue("preferences", data.user.preferences || []);

      if (data.user.skills) {
        const userSkills = data.user.skills.split(",");
        setUserSkills(userSkills);
      }
    }

    if (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      {loading && (
        <ScaleLoader
          width={6}
          height={80}
          radius={2}
          margin={6}
          color="skyblue"
          className="mx-auto text-center my-28"
        />
      )}
      <div className={`${loading && "hidden"} max-w-5xl mx-auto space-y-8`}>
        {/* User Info Section */}
        <Card className="bg-slate-900 shadow-lg">
          <CardHeader className="flex items-center gap-4">
            <Avatar>
              <AvatarImage
                src={user?.profileImg}
                alt="User Avatar"
                referrerPolicy="no-referrer"
              />
              <AvatarFallback>
                {user?.firstName?.[0]} {user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl text-center font-semibold text-white">
                {user?.firstName} {user?.lastName}
              </CardTitle>
              <p className="text-gray-400 text-center">{user?.email}</p>
              <p className="text-gray-400 text-center">{user?.mobileNo}</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              <strong>Country:</strong> {user?.country}
            </p>

            {user && user.accountType === "applicant" && (
              <>
                <p className="text-gray-300">
                  <strong>Bio:</strong> {user?.bio}
                </p>

                <div className="h-10 flex flex-wrap gap-2 mt-2">
                  Skills:{" "}
                  {userSkills ||
                    (userSkills?.length > 0 &&
                      userSkills.map((skill, index) => (
                        <p key={index}>{skill}</p>
                      )))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Update Profile Section */}
        <div className="bg-slate-900 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Update Profile
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* First Name */}
            <div>
              <Label>First Name</Label>
              <Input
                placeholder="John"
                {...register("firstName")}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <Label>Last Name</Label>
              <Input
                placeholder="Doe"
                {...register("lastName")}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Mobile */}
            <div>
              <Label>Mobile Number</Label>
              <Input
                placeholder="123-456-789"
                type="tel"
                {...register("mobileNo")}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Country */}
            <div>
              <Label>Country</Label>
              <Input
                placeholder="United States of America"
                {...register("country")}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Skills */}

            {user && user.accountType === "applicant" && (
              <div>
                <Label>Skills</Label>
                <Input
                  placeholder="React, Python, MongoDB"
                  {...register("skills")}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Bio */}
            <div>
              <Label>Bio</Label>
              <Textarea
                placeholder="Enter your bio..."
                {...register("bio")}
                rows={3}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Preferences */}

            {user && user.accountType === "applicant" && (
              <div>
                <Label>Job Preferences</Label>
                <Input
                  type="text"
                  placeholder="Press enter to add your preference"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim() !== "") {
                      append({ value: e.target.value.trim() });
                      e.target.value = "";
                      e.preventDefault();
                    }
                  }}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500"
                  disabled={watchPreferences.length > 4}
                />
              </div>
            )}

            {/* Preferences List */}
            <div className="mt-2 flex gap-6 items-center">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <span className="px-2 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-md">
                    {field.value}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
            {watchPreferences.length > 5 && (
              <p className="text-red-400">You can add only 5 preferences</p>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <Button type="submit" variant="blue">
                {updateInfoLoading ? (
                  <div className="w-7 h-7 rounded-full mx-auto loader disabled:cursor-not-allowed"></div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default UpdateProfile;
