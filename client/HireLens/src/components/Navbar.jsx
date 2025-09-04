import React from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="w-full bg-black text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-blue-500 text-2xl font-bold mr-2">✱</div>
        </div>

        {/* Navigation Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#home"
            className="text-blue-500 hover:text-blue-400 transition-colors duration-200 font-medium"
          >
            Home
          </a>
          <a
            href="#features"
            className="text-white hover:text-blue-400 transition-colors duration-200 font-medium"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-white hover:text-blue-400 transition-colors duration-200 font-medium"
          >
            How It Works
          </a>
          <a
            href="#testimonials"
            className="text-white hover:text-blue-400 transition-colors duration-200 font-medium"
          >
            Testimonials
          </a>
          <a
            href="#contact"
            className="text-white hover:text-blue-400 transition-colors duration-200 font-medium"
          >
            Contact
          </a>
        </div>

        {/* Mobile Menu Button (for responsive design) */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-blue-400"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
