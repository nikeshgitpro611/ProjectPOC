import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  conditionError,
  signinFailure,
  signinStart,
  signinSuccess,
} from "../redux/slice/userSlice";
import { Oauth } from "../components";

const SignIn = () => {
  const dispatch = useDispatch();
  // let test = useSelector((state) => state.user);

  const { loading, error } = useSelector((state) => state.user);

  const [formattedData, setFormattedData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormattedData({ ...formattedData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    let time;

    if (error) {
      time = setTimeout(() => {
        dispatch(conditionError());
      }, 5000);
      return () => clearTimeout(time);
    }
  }, [error, dispatch]);

  const handelSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signinStart());
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      console.log("data43", data);

      // dispatch(signinSuccess(data));
      if (data.success === false) {
        dispatch(signinFailure(data.message || "Something went wrong."));
        return;
      }
      dispatch(signinSuccess(data));
      navigate("/");
    } catch (err) {
      dispatch(
        signinFailure(
          err.message || "Failed to connect to the server. Please try again."
        )
      );
      // setError("Failed to connect to the server. Please try again later.");
    } finally {
      // dispatch(signinStart());
      setFormattedData({ email: "", password: "" });
    }
  };

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
        <Oauth />
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
