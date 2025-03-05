import React, { useEffect, useState } from "react";
import Login from "../components/Custom/Login";
import Register from "../components/Custom/Register";
import { FcGoogle } from "react-icons/fc";

import { useLocation } from "react-router-dom";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

import { googleAuth } from "../api/user";
import { loginUser } from "../redux/features/authSlice";
import { useDispatch } from "react-redux";

import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [accountType, setAccountType] = useState("");
  const location = useLocation();
  const { pathname } = location;

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (pathname === "applicant") {
      setAccountType("applicant");
    } else {
      setAccountType("recruiter");
    }
  }, [pathname]);

  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult.code, accountType);
        toast.success("successfuly logged in", {
          position: "top-right",
        });
        dispatch(loginUser(result?.data.user));
      } else {
        console.log(authResult);
        throw new Error(authResult);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  // const handleGoogleSignIn = async () => {
  //   // Check if the user has a refresh token (you'll need to fetch this from your backend)
  //   const refreshToken = await fetchRefreshToken(); // Implement this function
  //   if (refreshToken) {
  //     // Use the refresh token to get a new access token (call your backend endpoint)
  //     const newAccessToken = await fetchNewAccessToken(refreshToken); // Implement this function
  //     if (newAccessToken) {
  //       // Handle successful login with new access token
  //       const user = await fetchUserInformation(newAccessToken); // Implement this function
  //       dispatch(loginUser(user));
  //       return;
  //     } else {
  //       // Refresh token is invalid or expired, proceed with standard login
  //       googleLogin();
  //     }
  //   } else {
  //     googleLogin();
  //   }
  // };

  return (
    <>
      <div className="flex justify-center my-10 p-4">
        <div className="bg-[#212f3dc9] bg-opacity-90 rounded-lg p-8 w-full max-w-md ">
          {isSignUp ? <Register /> : <Login />}

          <button
            className="flex items-center justify-center w-full max-w-sm mx-auto py-2 px-4 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition duration-150 my-4"
            onClick={googleLogin}
          >
            <FcGoogle className="text-2xl mr-3" />
            <span className="text-gray-700 font-semibold">
              Sign in with Google
            </span>
          </button>

          <p className="mt-6 text-center text-sm text-gray-300">
            Don't have an account?{" "}
            <button
              className="text-gray-100 hover:underline"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Login" : "SignUp"}
            </button>
          </p>
          <p className="mt-6 text-center text-sm text-gray-300">
            <button
              className="text-gray-100 hover:underline"
              onClick={() => navigate("/forget-password")}
            >
              Forget Password
            </button>
          </p>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default AuthPage;
