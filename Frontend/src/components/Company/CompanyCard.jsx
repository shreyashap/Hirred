import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";

const CompanyCard = ({ company, setIsModalOpen, setCompany, handleDelete }) => {
  return (
    <div
      key={company._id}
      className="flex flex-col md:flex-row items-center justify-between bg-gray-700 p-4 rounded-md"
    >
      <div className="flex flex-col md:flex-row items-center gap-4">
        <img
          src={company.companyLogo}
          alt={company.companyName}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <Link to={`/company/${company._id}`}>
            <h2 className="text-lg font-bold text-white">
              {company.companyName}
            </h2>
          </Link>
          <p className="text-sm text-gray-400">{company.location}</p>
          <p className="text-sm text-gray-400">{company.companyDescription}</p>
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 underline"
          >
            {company.website}
          </a>
        </div>
      </div>
      <div className="flex gap-2 mt-2 md:mt-0">
        <Button
          variant="secondary"
          onClick={() => {
            setIsModalOpen(true);
            setCompany(company);
          }}
        >
          Edit
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default CompanyCard;
