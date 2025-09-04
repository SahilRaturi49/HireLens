import React from "react";
import { Brain, Video, GitFork } from "lucide-react";

const Features = () => {
  return (
    <div className=" bg-gray-950 py-16 flex flex-col items-center justify-center text-center px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-5 text-white">
          AI-POWERED FEATURES
        </h1>
        <p className="text-white">
          Experience the future of hiring with out intelligent tools designed
          for efficiancy and precision
        </p>
      </div>

      <div className="mt-12 mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {/* card 1 */}
        <div className="bg-black w-full flex flex-col items-center text-center rounded-xl shadow-lg p-8 hover:shadow-2xl transition hover:scale-105 duration-300">
          <Brain className="w-75 h-12 text-[#0a07b1] mb-4" />
          <h2 className="text-xl font-semibold mb-3 text-white">
            AI Resume Screening
          </h2>
          <p className="text-gray-400">
            Leverage advanced AI to accurately match candidates to job
            requirements, saving time and improving hiring quality
          </p>
        </div>
        {/* card 2 */}
        <div className="bg-black w-full flex flex-col items-center text-center rounded-xl shadow-lg p-8 hover:shadow-2xl transition hover:scale-105 duration-300">
          <Video className="w-75 h-12 text-[#0a07b1] mb-4" />
          <h2 className="text-xl font-semibold mb-3 text-white">
            AI Interview Assistant
          </h2>
          <p className="text-gray-400">
            Conduct intelligent interviews with AI support, analyzing response
            and providing unbiased assessments for better insights.
          </p>
        </div>
        {/* card 3 */}
        <div className="bg-black w-full flex flex-col items-center text-center rounded-xl shadow-lg p-8 hover:shadow-2xl transition hover:scale-105 duration-300">
          <GitFork className="w-75 h-12 text-[#0a07b1] mb-4" />
          <h2 className="text-xl font-semibold mb-3 text-white">
            Smart Job Matching
          </h2>
          <p className="text-gray-400">
            Connect with relevant opportunities instantly. Our AI understands
            your profile and career goals to find the perfect fit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
