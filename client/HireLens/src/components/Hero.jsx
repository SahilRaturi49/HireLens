import React from "react";

const Hero = () => {
  return (
    <section className="bg-[#00011a] py-12">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
        {/* Left side text */}
        <div className="pl-26">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Discover Your Next Big Opportunity with{" "}
            <span className="text-blue-900">Hire Lens</span>
          </h1>
          <p className="text-2xl pr-4 text-white font-light">
            Our AI-driven job portal redefines recruitment by instantly matching
            candidates with the right opportunities and conducting intelligent
            mock and real-time interviews. Whether you’re chasing your dream job
            or searching for top talent, we make the journey faster, fairer, and
            future-ready.
          </p>

          {/*Buttons*/}
          <div className="flex space-x-4 mt-9 justify-center">
            <button className="px-6 py-2 border-2 font-medium bg-black text-white rounded-lg hover:bg-blue-900 hover:text-black transition">
              Candidate Login
            </button>
            <button className="px-6 py-2 border-2 font-medium bg-black text-white rounded-lg hover:bg-blue-900 transition hover:text-black">
              Recruiter Login
            </button>
          </div>
        </div>

        {/* Right side text */}
        <div className="flex justify-center">
          <img
            src="/public/hero.jpg"
            alt=""
            className="w-40 h-90 md:w-64 lg:w-130 rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
