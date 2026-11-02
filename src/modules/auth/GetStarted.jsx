import React, { useState } from "react";
import logos from "../../assets/img/logo.png"
import image from "../../assets/img/Image.png"
import { useNavigate } from "react-router-dom";

const GetStarted = () => {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center  bg-gradient-to-br from-gray-100 via-gray-200 to-purple-300  px-4">

            <div className="max-w-xl w-full text-center">

                {/* Logo */}
                <div className="max-w-xl w-full text-center space-y-6">
                    <img
                        src={logos}
                        alt="Technokrate Logo"
                        className="max-w-[300px] mx-auto"
                    />
                </div>


                {/* Heading */}
                <h2 className="text-3xl font-medium text-[#141414] mb-5 mt-8">
                    Find The Right Talent For Your 
                </h2>

                <h3 className="text-xl flex  gap-1 font-medium text-[#7900BA] mb-6 justify-center">
                    Organization
                </h3>

                {/* Illustration */}
                <div className="flex justify-center mb-6">
                    <img
                        src={image}
                        alt="Job Search"
                        className="w-52 h-52 object-contain"
                    />
                </div>

                {/* Description */}
                <p className="text-gray-600 lg:mb-8 mb-0 leading-relaxed">
                    Discover Qualified Candidates That Match Your Company’s Requirements And Culture.
                </p>

                {/* Button */}
                <button
                    onClick={() => navigate("/landing-page")}
                    className="bg-[#7900BA] hover:opacity-90 text-white rounded-[8px] px-20 py-2  shadow-lg text-lg font-medium"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};
export default GetStarted