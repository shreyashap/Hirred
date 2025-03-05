import {
  Heart,
  MapPinIcon,
  BriefcaseIcon,
  Trash2Icon,
  CalendarIcon,
  AwardIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link } from "react-router-dom";
import { saveUnsaveJobs } from "../../api/searchFilterJob";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const JobCard = ({ job, isMyJob = false }) => {
  const [isSaved, setIsSaved] = useState();
  const [savedPage, setSavedPage] = useState(false);
  const location = useLocation();

  const user = useSelector((state) => state.auth.userInfo);
  const { pathname } = location;

  useEffect(() => {
    if (pathname === "/saved-jobs") {
      setSavedPage(true);
    }

    if (job?.savedBy && user?.savedJobs) {
      const isExist = job.savedBy.includes(user._id);

      isExist ? setIsSaved(true) : setIsSaved(false);
    }
  }, []);

  const toggleSaveJob = async () => {
    const { data, error } = await saveUnsaveJobs(job._id);

    if (data) {
      setIsSaved(!isSaved);
      toast.success(data.message, {
        position: "bottom-right",
      });
    }

    if (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Card className="flex flex-col bg-gradient-to-br from-gray-800 via-gray-950 to-black  rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl transition-shadow duration-300">
        {/* Header Section */}
        <CardHeader className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {job.companyLogo && (
              <img
                src={job.companyLogo}
                alt={`${job.companyName} logo`}
                className="h-14 w-14 rounded-full object-cover border border-gray-600"
              />
            )}
            <div>
              <CardTitle className="text-lg font-bold text-white">
                {job.title}
              </CardTitle>
              <p className="text-sm text-gray-400">{job.companyName}</p>
            </div>
          </div>
          {isMyJob && (
            <Trash2Icon
              size={20}
              className="text-red-500 cursor-pointer hover:text-red-600 transition-colors"
            />
          )}
        </CardHeader>
        {/* Content Section */}
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <MapPinIcon size={18} className="text-blue-500" />
            <span>
              {job.location} | {job.jobType}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <BriefcaseIcon size={18} className="text-green-500" />
            <span>{job.employmentType}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <CalendarIcon size={18} className="text-yellow-500" />
            <span>Posted: {new Date(job.createdAt).toDateString()}</span>
          </div>
          <hr />
        </CardContent>
        {/* Footer Section */}
        <CardFooter className="flex gap-2">
          <Link to={`/job/${job._id}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              More Details
            </Button>
          </Link>
          {!savedPage && (
            <Button variant="outline" className="w-15" onClick={toggleSaveJob}>
              {isSaved ? (
                <Heart size={20} fill="red" stroke="red" />
              ) : (
                <Heart size={20} />
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
      <Toaster />
    </>
  );
};

export default JobCard;
