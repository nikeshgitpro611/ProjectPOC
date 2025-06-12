import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { About, CreateListing, Home, Profile, SignIn, Signout, SignUp } from "./pages";
import { Header, PrivateRoute } from "./components";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signout" element={<Signout />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
