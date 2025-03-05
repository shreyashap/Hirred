import React from "react";

const Footer = () => {
  const today = new Date();
  const year = today.getFullYear();
  return (
    <footer>
      <div className="p-10 text-center bg-gray-800 mt-10">
        Made by Shreyash | Copyright &copy; {year}
      </div>
    </footer>
  );
};

export default Footer;
