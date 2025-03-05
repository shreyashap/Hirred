import React, { useEffect, useState } from "react";
import { deleteCompany, getAllCompanies } from "../../api/companyApi";

import { toast, Toaster } from "react-hot-toast";
import CompanyCard from "@/components/Company/CompanyCard";
import EditCompany from "./EditCompany";

const RecruiterCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [company, setCompany] = useState();

  const fetchCompanies = async () => {
    const { data, error } = await getAllCompanies(setLoading);
    if (data) {
      setCompanies(data.companies);
    }
    if (error) {
      toast.error("Failed to load companies");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?"))
      return;

    const { data, error } = await deleteCompany(id, setLoading);
    if (data) {
      toast.success("Company deleted successfully!");
      fetchCompanies(); // Refresh the list
    }
    if (error) {
      toast.error("Failed to delete the company");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="w-full bg-gray-950 p-6">
      <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-md">
        <h1 className="text-2xl font-semibold mb-4 text-white">
          Your Companies
        </h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading companies...</p>
        ) : companies.length === 0 ? (
          <p className="text-center text-gray-400">
            You have not created any companies yet.
          </p>
        ) : (
          <div className="grid gap-4">
            {companies?.map((company) => (
              <CompanyCard
                key={company._id}
                company={company}
                setIsModalOpen={setIsModalOpen}
                setCompany={setCompany}
                handleDelete={() => handleDelete(company._id)}
              />
            ))}
          </div>
        )}

        {isModalOpen && (
          <EditCompany
            companyDetails={company}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default RecruiterCompanies;
