import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { About, Home, Profile, SignIn, Signout, SignUp } from "./pages";
import { Header } from "./components";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signout" element={<Signout />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
