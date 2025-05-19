import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

const Header = () => {
  const [headerSearch, setHeaderSearch] = useState("");

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Signin", path: "/sign-up" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit : ", headerSearch);
  };

  const { currentUser } = useSelector((state) => state.user);
  console.log("currentUser", currentUser);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">MVN🏠 </span>
            <span className="text-slate-700"> Estate 📊</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          {/* Implement debouncing concept */}

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
          />

          {/* > search btn will show when user inter some thing */}

          {headerSearch && (
            <button type="submit" className="cursor-pointer">
              <FaSearch className="text-slate-600" />
            </button>
          )}
        </form>

        <ul className="flex gap-4">
          {currentUser ? (
            <Link to="/profile">
              <img
                src={currentUser?.avatar}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
            </Link>
          ) : (
            navItems.map((item) => (
              <li
                key={item.label}
                className="hidden sm:inline text-slate-700 hover:underline hover:text-slate-900"
              >
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
