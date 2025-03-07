import { Button } from "../components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import MDEditor, { selectLine } from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "../components/ui/select";
import { postJob } from "../api/postJobApi";
import { getCompanyNames } from "../api/companyApi";
import { postJobSchema } from "../schemas/companySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const PostJob = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: errors,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(postJobSchema),
  });

  const [tagInput, setTagInput] = useState("");
  const [keyword, setKeyword] = useState([]);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const companyNames = async () => {
      const { data, error } = await getCompanyNames(setLoading);

      if (data) {
        setCompanies(data.company);
      }

      if (error) {
        console.error(error);
      }
    };

    companyNames();
  }, []);

  const onSubmit = async (d) => {
    const job = new FormData();

    const location = `${country.name}-${state.name}-${city.name}`;

    job.append("title", d.title);
    job.append("description", d.description);
    job.append("jobLocation", location);
    job.append("jobType", d.jobType);
    job.append("tags", JSON.stringify(keyword));
    job.append("employmentType", d.employmentType);
    job.append("company", d.company);
    reset();

    const { data, error } = await postJob(job, setLoading);

    if (data) {
      toast.success(data?.message);
    }

    if (error) {
      if (error.data.errorMsg) {
        toast.error(error.data?.errorMsg);
      }
      console.error(error);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !keyword.includes(tagInput.trim())) {
      setKeyword((prevKeyword) => [...prevKeyword, tagInput.trim()]);
    }

    setTagInput("");
  };

  const removeTag = (keywordToRemove) => {
    const updatedKeywords = keyword.filter((tag) => tag !== keywordToRemove);

    setKeyword(updatedKeywords);
  };

  const addNewCompany = (value) => {
    if (value === "Create One") {
      navigate("/add-company");
    }
  };

  if (country && state && city) {
    console.log(country.name, state.name, city.name);
  }

  return (
    <>
      <section className="w-full max-w-6xl mx-auto min-h-screen p-10 ">
        <div>
          <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
            Post a Job
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-4 pb-0"
          >
            <Input placeholder="Job Title" {...register("title")} />
            {errors.title && (
              <p className="text-red-400">{errors.title.message}</p>
            )}
            <div data-color-mode="dark">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <MDEditor
                    {...field}
                    value={field.value}
                    onChange={(newValue) => setValue("description", newValue)}
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-400">{errors.description.message}</p>
              )}
            </div>
            <Controller
              name="company"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    addNewCompany(value);
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company">
                      {field.value || "Select a company"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((c, index) => (
                      <SelectItem key={index} value={c.companyName}>
                        {c.companyName}
                      </SelectItem>
                    ))}
                    <SelectItem value="Create One">Create One</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.company && (
              <p className="text-red-400">{errors.company.message}</p>
            )}
            <hr className="my-4" />

            <Label>Select Country</Label>
            <CountrySelect
              containerClassName="form-group text-white"
              inputClassName="bg-[#030a1e] text-white border-[1px] border-gray-500"
              onChange={(_country) => setCountry(_country)}
              placeHolder="Select Country"
            />

            <Label>Select State</Label>
            <StateSelect
              countryid={country?.id}
              containerClassName="form-group"
              inputClassName="bg-[#030a1e] border-[1px] border-gray-500"
              onChange={(_state) => setState(_state)}
              defaultValue={state}
              placeHolder="Select State"
            />

            <Label>Select City</Label>
            <CitySelect
              countryid={country?.id}
              stateid={state?.id}
              containerClassName="form-group"
              inputClassName="bg-[#030a1e] border-[1px] border-gray-500"
              onChange={(_city) => setCity(_city)}
              defaultValue={city}
              placeHolder="Select City"
            />

            <Label htmlFor="jobType">Job Type</Label>
            <Controller
              name="jobType"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type">
                      {field.value || "Select job type"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="In-Office">In-Office</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.jobType && (
              <p className="text-red-400">{errors.jobType.message}</p>
            )}
            <Label htmlFor="employmentType">Employment Type</Label>
            <Controller
              name="employmentType"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type">
                      {field.value || "Select employment type"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.employmentType && (
              <p className="text-red-400">{errors.employmentType.message}</p>
            )}
            <div>
              <label htmlFor="tags" className="block font-medium mb-2">
                Tags:
              </label>
              <div className="flex items-center gap-2">
                <Input
                  value={tagInput}
                  placeholder="Enter a tag and press Add"
                  onChange={(e) => setTagInput(e.target.value)}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {keyword.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => removeTag(tag)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <Button
              type="submit"
              variant="blue"
              size="lg"
              className="mt-2"
              disabled={loading}
            >
              {loading ? (
                <div className="w-7 h-7 rounded-full mx-auto loader disabled:cursor-not-allowed"></div>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </div>
      </section>
      <Toaster />
    </>
  );
};

export default PostJob;
