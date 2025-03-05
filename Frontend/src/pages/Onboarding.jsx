import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center mt-40 px-8 md:px-0">
      <h2 className="gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter">
        I am a...
      </h2>
      <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">
        <Button
          variant="blue"
          className="h-20 w-36 sm:w-40 text-xl md:w-[90%] md:h-28 lg:h-32 md:text-3xl"
          onClick={() => navigate("/applicant")}
        >
          Candidate
        </Button>
        <Button
          variant="destructive"
          className="h-20 w-36 sm:w-40 text-xl md:w-[90%] md:h-28 lg:h-32 md:text-3xl"
          onClick={() => navigate("/recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
