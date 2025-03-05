import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "@/redux/features/authSlice";
import ProfileButton from "./Profile";
import { useEffect } from "react";
import { MessageSquareMore } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const role =
    location.pathname.includes("applicant") ||
    location.pathname.includes("recruiter");

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token && !user) {
      dispatch(loginUser(token));
    }
  }, [dispatch, user]);

  return (
    <div>
      <nav className="py-4 flex justify-between items-center mx-10 sm:mx-14 md:mx-20 lg:mx-24">
        <Link to="/">
          <img src="/logo.png" alt="hirrd logo" className="h-20 object-cover" />
        </Link>

        <div className="flex justify-between items-center gap-6">
          {!user ? (
            !role && (
              <Link
                to="/onboarding"
                variant="outline"
                className="bg-white text-black transition-colors delay-75 border-0 outline-none px-3 py-2 rounded-md font-medium hover:text-white hover:bg-gray-800"
              >
                Login
              </Link>
            )
          ) : (
            <>
              <Link to={`/chat/${user._id}`}>
                <MessageSquareMore className="mt-1" />
              </Link>
              <ProfileButton />
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
