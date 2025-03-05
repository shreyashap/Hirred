import { useSelector } from "react-redux";
import LandingPage from "../../pages/LandingPage";
import PostJob from "../../pages/PostJob";
import Jobs from "../../pages/Jobs";
import { useEffect } from "react";

import { loginUser } from "../../redux/features/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user && !userInfo) {
      dispatch(loginUser(user));
    }

    // if (userInfo?.accountType === "applicant") {
    //   navigate("/jobs");
    // }
  }, [dispatch, userInfo]);

  // useEffect(() => {
  //   if (userInfo) {
  //     if (userInfo.accountType === "applicant") {
  //       navigate("/jobs");
  //     } else if (userInfo.accountType === "recruiter") {
  //       navigate("/post-job");
  //     }
  //   }
  // }, [userInfo, navigate]);

  return <>{userInfo ? children : <LandingPage />}</>;
};

export default ProtectedRoute;
