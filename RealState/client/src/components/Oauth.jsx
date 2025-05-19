import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase/firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signinSuccess } from "../redux/slice/userSlice";

const Oauth = () => {
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      console.log("result", result);

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.user),
      })

      const data = await response.json();
      dispatch(signinSuccess(data));
      navigate("/");

      console.log("data23", data);
    } catch (error) {
      console.log(" Some thing went wrong", error);
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    // <div>
    <button
      onClick={handleGoogleClick}
      className="bg-orange-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
    >
      continue with google 📧
    </button>
    // </div>
  );
};

export default Oauth;
