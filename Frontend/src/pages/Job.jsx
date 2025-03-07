import React, { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { useParams } from "react-router-dom";
import { getSingleJob, getJobApplications } from "../api/postJobApi";
import { updateJobActiveStatus } from "../api/applyJob";
import { MapPin, Briefcase, DoorOpen, DoorClosed } from "lucide-react";
import ApplyJobDrawer from "@/components/JobApplication/Application";
import toast, { Toaster } from "react-hot-toast";
import ApplicationCard from "@/components/Company/ApplicationCard";
import { BarLoader } from "react-spinners";
import { searchJob } from "../api/applyJob";

const SingleJobPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [activeStatusLoading, setActiveStatusLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [search, setSearch] = useState();

  const [selectedFilter, setSelectedFilter] = useState();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setAccountType(user.accountType);
    }
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await getSingleJob(id, setLoading);
      if (data) {
        setJob(data.job);
        setIsApplied(data.isApplied);
      } else {
        console.error(error);
      }
      setLoading(false);
    };

    fetchJob();
  }, [id, activeStatusLoading]);

  useEffect(() => {
    const fetchApplications = async () => {
      const { data, error } = await getJobApplications(id, setSearchLoading);

      if (data) {
        console.log(data);
        setApplications(data.applications);
      }

      if (error) {
        if (error.data.errorMsg) {
          toast.error(error.data.errorMsg);
        }
        console.error(error);
      }
    };

    if (accountType && accountType === "recruiter") {
      if (!search && !selectedFilter) {
        fetchApplications();
      }
    }
  }, [accountType, id, selectedFilter]);

  const handleApplyClick = () => {
    setIsDrawerOpen(true);
  };

  const handleStatusChange = async (activeStatus) => {
    const updatedStaus = {
      activeStatus,
    };

    const { data, error } = await updateJobActiveStatus(
      updatedStaus,
      id,
      setActiveStatusLoading
    );

    if (data) {
      toast.success(data.message);
    }

    if (error) {
      console.error(error);
    }
  };

  const handleChange = async (e) => {
    setSearch(e.target.value);

    const { data, error } = await searchJob(
      e.target.value,
      selectedFilter,
      setSearchLoading,
      id
    );

    if (data) {
      setApplications(data.applications);
    }

    if (error) {
      console.error(error);
    }
  };

  const handleScoreChange = async (d) => {
    setSelectedFilter(d);
    const { data, error } = await searchJob(search, d, setSearchLoading, id);

    if (data) {
      setApplications(data.applications);
    }

    if (error) {
      console.error(error);
    }
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearch("");
    setSelectedFilter("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="spinner">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Job not found.
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg my-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <h1 className="text-4xl font-extrabold text-blue-400">{job.title}</h1>
          <img
            src={job.companyLogo || "https://via.placeholder.com/100"}
            alt={`${job.companyName} logo`}
            className="h-16 w-16 rounded-lg object-cover"
          />
        </div>

        {/* Job Info Section */}
        <div className="flex flex-wrap justify-between text-sm mt-4 gap-4 border-t border-gray-700 pt-4">
          <div className="flex items-center gap-2">
            <MapPin className="text-gray-400" />
            {job.location}
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="text-gray-400" />
            {job.employmentType} | {job.jobType}
          </div>
          <div className="flex items-center gap-2">
            {job.isActive ? (
              <>
                <DoorOpen className="text-green-400" /> Open
              </>
            ) : (
              <>
                <DoorClosed className="text-red-400" /> Closed
              </>
            )}
          </div>
        </div>

        {/* Tags */}
        {job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {job.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-700 text-gray-300 px-3 py-1 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {accountType && accountType === "recruiter" && (
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger
              className={`w-full ${
                job?.isActive ? "bg-green-950" : "bg-red-950"
              } mt-5`}
            >
              <SelectValue
                placeholder={
                  "Hiring Status " + (job?.isActive ? "( Open )" : "( Closed )")
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        )}
        {accountType === "recruiter" && activeStatusLoading && (
          <BarLoader width={"100%"} color="#36d7b7" className="mt-4" />
        )}

        {/* Description */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">About the Job</h2>
          <div className="p-4 rounded-lg">
            <MDEditor.Markdown
              source={job.description}
              className="text-gray-300 p-4 bg-gray-900"
            />
          </div>
        </div>

        {/* Apply Button */}
        {accountType && accountType === "applicant" && (
          <>
            <div className="mt-6 flex justify-end">
              {isApplied ? (
                <p className="px-6 py-2 text-green-400">Applied ✅</p>
              ) : (
                <Button
                  className="px-6 py-2"
                  variant="blue"
                  disabled={!job.isActive}
                  onClick={handleApplyClick}
                >
                  Apply Now
                </Button>
              )}
            </div>
            <ApplyJobDrawer
              isOpen={isDrawerOpen}
              setIsDrawerOpen={setIsDrawerOpen}
              setIsApplied={setIsApplied}
            />
          </>
        )}

        {accountType === "recruiter" && (
          <form className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 my-4">
            <Input
              type="text"
              placeholder="Search for candidate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={handleChange}
            />
            <Select value={selectedFilter} onValueChange={handleScoreChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Above 90">Above 90</SelectItem>
                <SelectItem value="Between 70 & 90">Between 70 & 90</SelectItem>
                <SelectItem value="Below 70">Between 50 & 70</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="reset"
              className="bg-red-500 hover:cursor-pointer hover:bg-red-600 text-white"
              onClick={handleClearFilters}
            >
              Reset
            </Button>
          </form>
        )}

        {searchLoading ? (
          <p>Loading...</p>
        ) : (
          accountType === "recruiter" && (
            <div className="flex flex-col gap-2">
              <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
              {applications.map((application) => {
                return (
                  <ApplicationCard
                    key={application._id}
                    application={application}
                    jobId={id}
                  />
                );
              })}
            </div>
          )
        )}
      </div>
      <Toaster />
    </>
  );
};

export default SingleJobPage;
