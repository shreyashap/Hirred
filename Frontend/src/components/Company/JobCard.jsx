import {
  Heart,
  MapPinIcon,
  Trash2Icon,
  Briefcase,
  AwardIcon,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import removeMarkdown from "remove-markdown";

import { deleteJob } from "../../api/postJobApi";
import { Toaster, toast } from "react-hot-toast";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [loadingDeleteJob, setLoadingDeleteJob] = useState(false);

  useEffect(() => {
    if (job) {
      const jobDes = removeMarkdown(job.description);
      if (jobDes) {
        setDescription(jobDes);
      }
    }
  });

  const handleDeleteJob = async () => {
    const { data, error } = await deleteJob(job._id, setLoadingDeleteJob);
    if (data) {
      console.log(data);
      toast.success("Job deleted successfully", {
        position: "top-right",
      });

      setTimeout(() => {
        navigate("/companies");
      }, 1000);
    }

    if (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Card className="flex flex-col">
        {loadingDeleteJob && (
          <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
        )}
        <CardHeader className="flex">
          <CardTitle className="flex justify-between font-bold">
            {job.title}
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
              onClick={handleDeleteJob}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1">
          <div className="flex sm:flex-row sm:justify-between">
            {job.company && (
              <img src={job.companyLogo} className="h-6 object-cover" />
            )}
            <div className="flex gap-2 items-center mt-12 text-sm sm:mt-0">
              <MapPinIcon size={15} /> {job.location}{" "}
              <Briefcase size={15} className="ml-4" />
              {job.employmentType}
            </div>
          </div>
          <hr />
          {description.substring(0, description.indexOf("."))}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Link to={`/company/job/${job._id}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              More Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <Toaster />
    </>
  );
};

export default JobCard;
