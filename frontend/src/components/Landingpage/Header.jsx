import React from "react";
import logo from "../../assets/logo.png";

const Header = () => (
  <header className="fixed w-full z-40 bg-white/70 backdrop-blur-lg shadow-sm">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={logo} alt="JobHub" className="w-10 h-10" />
        <span className="font-semibold text-lg">GlobalJobHub</span>
      </div>

      <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
        <a href="/#how" className="hover:text-blue-600">How it works</a>
        <a href="/browse" className="hover:text-blue-600">Browse jobs</a>
        <a href="/employers" className="hover:text-blue-600">Employers</a>
        <a href="/about" className="hover:text-blue-600">About</a>
        <a href="/login" className="ml-4 px-4 py-2 border rounded-lg hover:bg-gray-100">Login</a>
        <a href="/register" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Sign up</a>
      </nav>
    </div>
  </header>
);

export default Header;
