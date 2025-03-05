import React, { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import JobCard from "../components/Custom/JobBoard";
import { getAllJobs } from "../api/postJobApi";
import { GetCountries } from "react-country-state-city";
import { getAllCompanyNames } from "../api/companyApi";
import { ScaleLoader, BarLoader } from "react-spinners";
import { searchJobs, filterJobs } from "../api/searchFilterJob";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [countriesList, setCountriesList] = useState();
  const [companies, setCompanies] = useState();
  const [companyLoading, setCompanyLoading] = useState(true);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedEmployment, setSelectedEmployment] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [search, setSearch] = useState("");

  const [searchLoading, setSearchLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    const getJobs = async () => {
      const { data, error } = await getAllJobs(currentPage, setLoading);
      if (data) {
        setJobs(data.jobs);
        setPage(data.currentPage);
        setTotalPages(data.totalPages);
      }

      if (error) {
        console.error(error);
      }
    };

    if (
      !selectedCompany &&
      !selectedEmployment &&
      !selectedJob &&
      !selectedLocation &&
      !search
    )
      getJobs();
  }, [setCurrentPage]);

  useEffect(() => {
    GetCountries().then((result) => {
      setCountriesList(result);
    });

    const fecthCompanies = async () => {
      const { data, error } = await getAllCompanyNames(setCompanyLoading);

      if (data) {
        setCompanies(data.company);
      }

      if (error) {
        console.error(error);
      }
    };
    fecthCompanies();
  }, []);

  useEffect(() => {
    const filterJob = async () => {
      const { data, error } = await filterJobs(
        selectedLocation,
        selectedCompany,
        selectedEmployment,
        selectedJob,
        setFilterLoading
      );

      if (data) {
        setJobs(data.jobs);
      }

      if (error) {
        console.error(error);
      }
    };

    if (
      selectedCompany ||
      selectedLocation ||
      selectedEmployment ||
      selectedJob
    )
      filterJob();
  }, [selectedLocation, selectedCompany, selectedEmployment, selectedJob]);

  const handleNextPage = () => {
    if (currentPage) {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleClearFilters = async () => {
    setSelectedCompany("");
    setSelectedLocation("");
    setSelectedEmployment("");
    setSelectedJob("");
    setSearch("");

    const { data, error } = await getAllJobs(currentPage, setLoading);
    if (data) {
      setJobs(data.jobs);
      setPage(data.currentPage);
      setTotalPages(data.totalPages);
    }

    if (error) {
      console.error(error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search) {
      const { data, error } = await searchJobs(search, setSearchLoading);
      if (data) {
        setJobs(data.jobs);
      }

      if (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-10 md:mx-auto my-12">
        <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
          Latest Jobs
        </h1>
        <form className="h-14 flex flex-row w-full gap-2 items-center mb-3">
          <Input
            type="text"
            placeholder="Search Jobs by Title.."
            className="h-full flex-1 px-4 text-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            className="h-full sm:w-28"
            variant="blue"
            onClick={handleSearch}
          >
            Search
          </Button>
        </form>
        {searchLoading && (
          <BarLoader width={"100%"} color="#36d7b7" className="my-4" />
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={selectedLocation}
            onValueChange={(value) => setSelectedLocation(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Location" />
            </SelectTrigger>
            <SelectContent className="h-40">
              {countriesList?.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedCompany}
            onValueChange={(value) => setSelectedCompany(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Company" />
            </SelectTrigger>
            <SelectContent>
              {companies?.map((c) => (
                <SelectItem key={c.companyName} value={c.companyName}>
                  {c.companyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedEmployment}
            onValueChange={(value) => setSelectedEmployment(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Employment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-Time">Full-Time</SelectItem>
              <SelectItem value="Part-Time">Part-Time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedJob}
            onValueChange={(value) => setSelectedJob(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="In-Office">In-Office</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>

          <Button
            className="sm:w-1/2"
            variant="destructive"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>

        {filterLoading && (
          <BarLoader width={"100%"} color="#36d7b7" className="my-4" />
        )}

        {loading && (
          <BarLoader width={"100%"} color="#36d7b7" className="my-4" />
        )}

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-10">
          {jobs.length ? (
            jobs.map((job) => <JobCard key={job._id} job={job} />)
          ) : (
            <div>No Jobs Found 😢</div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="mt-8 flex justify-center items-center gap-4">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <Button variant={`${currentPage === page ? "blue" : "outline"}`}>
            {page}
          </Button>
          <Button onClick={handleNextPage} variant="outline">
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default Jobs;
