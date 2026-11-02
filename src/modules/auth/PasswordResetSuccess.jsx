import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import logo from "../../assets/img/logo.png";
import rightImg from "../../assets/img/Powerful-bro 1.png";
import rightSideBG from "../../assets/img/Vector.png";
import Skip from "../skip/skip";
import succ from "../../assets/img/success.png"

const PasswordResetSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-white relative overflow-hidden">
      <Skip />
      <div className="w-full lg:w-[60%] flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-20">
        <img src={logo} alt="logo" className="w-87.5 height-[80px] mb-6" />

        <div className="w-full max-w-107.5 bg-white shadow-[0_0_8px_0_#585858] rounded-lg px-6 sm:px-10 py-10">
          
          <div className="flex items-center justify-center mb-12">
            <img src={succ} alt="" className="w-27 h-27" />
          </div>
          
          <h2 className="text-3xl sm:text-[34px] font-extrabold text-[#7900BA] text-center">
            Reset <br />Password
          </h2>

          <p className="text-center text-black mt-1.75 mb-9 text-[16px]">
            Password reset successfully
          </p>

          <button
            onClick={() => navigate("/login")}
            type="button"
            className="w-full h-11.5 bg-[#7900BA] hover:bg-[#5B21B6] text-white rounded-md font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
      <div className="hidden lg:flex w-[50%] items-center justify-center relative">
        <img
          src={rightSideBG}
          className="absolute right-0 top-0 w-125 z-0"
          alt=""
        />

        <img src={rightImg} className="relative z-10 w-115" alt="" />
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
