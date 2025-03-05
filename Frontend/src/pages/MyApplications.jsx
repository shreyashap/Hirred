import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { getMyApplications } from "../api/postJobApi";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  Download,
  UserRoundPen,
  Mail,
  Boxes,
  TabletSmartphone,
} from "lucide-react";

const MyApplications = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState();
  useEffect(() => {
    const fecthApplications = async () => {
      const { data, error } = await getMyApplications(setLoading);

      if (data) {
        setApplications(data.applications);
      }

      if (error) [console.error(error)];
    };
    fecthApplications();
  }, []);

  const handleDownload = (application) => {
    const link = document.createElement("a");
    link.href = application.resume;
    link.target = "_blank";
    link.click();
  };

  if (!applications) {
    return <p>No applications found</p>;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        My Applications
      </h1>
      {loading && (
        <ScaleLoader
          width={6}
          height={80}
          radius={2}
          margin={6}
          color="skyblue"
          className="mx-auto text-center mt-28"
        />
      )}
      <div className="max-w-6xl mx-auto flex flex-col gap-2">
        {applications.map((application) => (
          <Card key={application._id}>
            <CardHeader>
              <CardTitle className="flex justify-between font-bold">
                <Download
                  size={18}
                  className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
                  onClick={() => handleDownload(application)}
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
                  <Boxes size={15} /> Status : {application?.status}
                </div>
                <div className="flex gap-2 items-center">
                  <TabletSmartphone size={15} /> {application?.mobileNo}
                </div>
              </div>
              <hr />
              <div>
                {application?.coverLetter && (
                  <>
                    <p>Cover Letter</p>
                    <p>{application?.coverLetter}</p>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <span>
                {new Date(application.createdAt).toDateString()}{" "}
                {new Date(application.createdAt).toLocaleTimeString()}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
