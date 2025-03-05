import {
  Boxes,
  BriefcaseBusiness,
  Download,
  School,
  UserRoundPen,
  Mail,
  TabletSmartphone,
  Table,
  AwardIcon,
  UserRoundPlus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import { BarLoader } from "react-spinners";
import { useState } from "react";
import { updateJobStatus } from "../../api/applyJob";
import toast, { Toaster } from "react-hot-toast";
import { startConversation } from "../../api/message";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ApplicationCard = ({ application, jobId }) => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const [loadingHiringStatus, setLoadingHiringStatus] = useState(false);

  const handleStatusChange = async (newStatus) => {
    const status = {
      newStatus,
    };
    const { data, error } = await updateJobStatus(
      status,
      jobId,
      application._id,
      setLoadingHiringStatus
    );

    if (data) {
      toast.success(data.message, {
        position: "top-right",
      });
    }

    if (error) {
      console.error(error);
    }
  };

  const handleAddToChat = async () => {
    if (user) {
      const { data, error } = await startConversation(
        user._id,
        application.appliedBy._id,
        jobId,
        setLoading
      );

      if (data) {
        console.log(data);
        toast.success("Added to chat", {
          position: "top-right",
        });

        setTimeout(() => {
          navigate(`/chat/${user?._id}`);
        }, 1000);
      }

      if (error) {
        if (error.data.errorMsg) {
          toast.error(error.data.errorMsg, {
            position: "top-right",
          });
        }
        console.error(error);
      }
    }
  };

  return (
    <>
      <Card>
        {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
        {loading && <BarLoader width={"100%"} color="#36d7b7" />}
        <CardHeader>
          <CardTitle className="flex justify-between font-bold">
            <Download
              size={18}
              className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer hover:bg-gray-200"
              onClick={handleDownload}
            />
            <UserRoundPlus
              size={18}
              className={`bg-white text-black rounded-full h-8 w-8 p-1.5  cursor-pointer hover:bg-gray-200 ${
                loading && "cursor-not-allowed"
              }`}
              onClick={handleAddToChat}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex gap-2 items-center">
              <UserRoundPen size={15} /> {application?.applicantFullName}{" "}
            </div>
            <div className="flex gap-2 items-center">
              <Mail size={15} />
              {application?.applicantEmail}
            </div>
            <div className="flex gap-2 items-center">
              <Boxes size={15} /> Score : {application?.score}
            </div>
            <div className="flex gap-2 items-center">
              <TabletSmartphone size={15} /> {application?.mobileNo}
            </div>
          </div>
          <hr />
          <div>
            {application.coverLetter && (
              <>
                <p>Cover Letter</p>
                <p>{application.coverLetter}</p>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <span>{new Date(application.createdAt).toLocaleString()}</span>
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger className="w-52">
              <SelectValue
                placeholder={application.status || "Select application status"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Application Status</SelectLabel>
                <SelectItem value="Reviewed">Reviewed</SelectItem>
                <SelectItem value="Interviewing">Interviewing</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardFooter>
      </Card>
      <Toaster />
    </>
  );
};

export default ApplicationCard;
