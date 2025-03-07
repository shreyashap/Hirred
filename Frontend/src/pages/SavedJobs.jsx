import React, { useEffect, useState } from "react";
import { BarLoader, ScaleLoader } from "react-spinners";
import { getSavedJobs } from "../api/searchFilterJob";
import JobCard from "../components/Custom/JobBoard";

const SavedJobs = () => {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const getJobs = async () => {
      const { data, error } = await getSavedJobs(setLoading);
      if (data) {
        setJobs(data?.savedJobs.savedJobs);
      }

      if (error) {
        console.error(error);
      }
    };
    getJobs();
  }, []);

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl text-center pb-8">
        Saved Jobs
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

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-10">
        {jobs?.length ? (
          jobs.map((job) => <JobCard key={job._id} job={job} />)
        ) : (
          <div>No Saved Jobs 😢</div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
