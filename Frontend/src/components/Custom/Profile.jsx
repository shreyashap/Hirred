import React, { useDebugValue, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/features/authSlice";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { logout } from "../../api/user";
import { getUser } from "../../api/user";

const ProfileButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getUserInfo = async () => {
      const { data, error } = await getUser();
      if (data?.user) {
        setUserData(data.user);
      }
      if (error) {
        if (error === "Invalid access token format") {
          dispatch(logoutUser());
        }
        console.error(error);
      }
    };
    getUserInfo();
  }, []);

  const handleLogout = async () => {
    const { data, error } = await logout();

    if (data) {
      dispatch(logoutUser());
      navigate("/");
    }

    if (error) {
      if (error === "Invalid access token format") {
        dispatch(logoutUser());
      }
      console.error(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex justify-center items-center rounded-full cursor-pointer">
          {/* <Avatar>
              {userData.profileImg ? (
                <AvatarImage
                  src={userData?.profileImg}
                  className="object-cover border-2 border-gray-500 w-full h-full rounded-full"
                />
              ) : (
                <AvatarFallback>
                  {userData.firstName[0].toUpperCase()}
                  {userData.lastName[0].toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar> */}

          <Avatar>
            {userData?.profileImg ? (
              <AvatarImage
                src={userData?.profileImg}
                className="object-cover border-2 border-gray-500 w-full h-full rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <AvatarFallback>
                {userData?.firstName?.[0]?.toUpperCase() || " "}
                {userData?.lastName?.[0]?.toUpperCase() || " "}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className="w-48">
        <DropdownMenuItem
          onClick={() => navigate(`/profile-update/${userData._id}`)}
        >
          Update Profile
        </DropdownMenuItem>
        {userData.accountType === "applicant" && (
          <>
            <DropdownMenuItem onClick={() => navigate("/my-applications")}>
              My Applications
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/saved-jobs")}>
              Saved Jobs
            </DropdownMenuItem>
          </>
        )}
        {userData.accountType === "recruiter" && (
          <>
            <DropdownMenuItem onClick={() => navigate("/companies")}>
              Companies
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/add-company")}>
              Add Company
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem onClick={handleLogout} className="text-red-500">
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
