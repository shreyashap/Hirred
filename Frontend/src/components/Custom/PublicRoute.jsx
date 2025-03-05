import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/features/authSlice";

const PublicRoute = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user && !userInfo) {
      dispatch(loginUser(user));
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.accountType === "applicant") {
        navigate("/jobs");
      } else if (userInfo.accountType === "recruiter") {
        navigate("/post-job");
      }
    }
  }, [userInfo, navigate]);

  return <>{!userInfo && children}</>;
};

export default PublicRoute;
