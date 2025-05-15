import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState({
    
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormattedData({ ...formattedData, [e.target.id]: e.target.value });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();
      console.log("dataPass Confirm :::: ", data);

      if (!response.ok) {
        setError(data?.message || "Something went wrong. Please try again.");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again later.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
      setFormattedData({ username: "", email: "", password: "" });
    }
  };

  console.log("formattedData", formattedData, error);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handelSubmit} className="flex flex-col gap-4">
        

        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          value={formattedData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          value={formattedData.password}
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-up"} className="text-blue-600">
          <span className="text-blue-700">Sign-Up</span>
        </Link>
      </div>
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
};

export default SignIn;
