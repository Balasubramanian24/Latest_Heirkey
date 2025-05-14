import React from "react";

const Footer: React.FC = () => (
  <div className="flex justify-between items-center text-base px-4 mt-10">
    <a href="/" className="text-[#2BCFD5] font-semibold flex items-center">
      <span role="img" aria-label="home">🏠</span>
      <span className="ml-1">Back to Home</span>
    </a>
    <a href="#" className="text-gray-500 font-semibold">Get Help</a>
  </div>
);

export default Footer;
