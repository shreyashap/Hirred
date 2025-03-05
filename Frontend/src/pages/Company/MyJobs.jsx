import React, { useEffect, useState } from "react";

import { getJobByCompany } from "../../api/postJobApi";
import { useParams } from "react-router-dom";
import JobCard from "../../components/Company/JobCard";
import { BarLoader } from "react-spinners";

const MyJobs = () => {
  const [loading, setLoading] = useState();
  const [createdJobs, setCreatedJobs] = useState();
  const { id } = useParams();

  useEffect(() => {
    const getJob = async () => {
      const { data, error } = await getJobByCompany(id, setLoading);

      if (data) {
        console.log(data);
        setCreatedJobs(data.jobs);
      }

      if (error) {
        console.error(error);
      }
    };

    getJob();
  }, []);

  return (
    <div>
      {loading ? (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      ) : (
        <div className="max-w-full mx-10 mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {createdJobs?.length ? (
            createdJobs.map((job) => {
              return <JobCard key={job._id} job={job} />;
            })
          ) : (
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
