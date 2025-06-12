import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSuccess,
  deleteUserFailure,
  progressUpload,
} from "../redux/slice/userSlice";
import { Link } from "react-router-dom";
import { set } from "mongoose";

const Profile = () => {
  const { currentUser, progress, status } = useSelector((state) => state.user);
  const [showListing, setShowListing] = useState(false);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [localStoreImage, setLocalStoreImage] = useState(null);
  const [listingData, setListingData] = useState([]);

  // Handle file upload to localStorage
  useEffect(() => {
    if (!file) return;

    const uploadFile = async () => {
      dispatch(
        progressUpload({ progress: 0, status: "Image Uploading ↗️..." })
      );
      setUploadError(null);

      try {
        const reader = new FileReader();

        reader.onprogress = (event) => {
          if (!event.lengthComputable) return;

          let progress = 0;
          const interval = setInterval(() => {
            if (progress < 100) {
              progress += 1;
              dispatch(
                progressUpload({
                  progress,
                  status:
                    progress === 100
                      ? "Image Upload Completed 😊."
                      : "Image Uploading ↗️...",
                })
              );
            } else {
              clearInterval(interval);
            }
          }, 100);
        };

        reader.onload = () => {
          try {
            localStorage.setItem("avatar", reader.result);
          } catch (error) {
            setUploadError("Failed to store image in localStorage");
            console.error("Error storing in localStorage:", error);
          }
        };

        reader.onerror = () => {
          setUploadError("Failed to read file");
          console.error("Error reading file:", reader.error);
        };

        reader.readAsDataURL(file);
      } catch (error) {
        setUploadError("Error processing file");
        console.error("Error initiating FileReader:", error);
      }
    };

    uploadFile();
  }, [file, dispatch]);

  const handleDelete = async (_id) => {
    console.log("_id", _id);

    try {
      const res = await fetch(`/api/user/delete/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      console.log("res pass", res);

      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteSuccess());
    } catch (error) {
      console.log(error);
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const imageUrl = URL.createObjectURL(selectedFile);
      const imageData = {
        image: selectedFile, // the file object
        url: imageUrl, // the preview URL
      };
      // setFile(imageData)
      setLocalStoreImage(imageData);
    }
  };

  // Handle image click to trigger file input
  const handleImageClick = () => {
    fileRef.current?.click();
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/signout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteSuccess());
      console.log(data);
    } catch (error) {
      console.log(error);
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handelShowListing = async () => {
    try {
      setShowListing(false);
      const response = await fetch(`/api/user/listingId/${currentUser._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setShowListing(true);
        return;
      }
      const data = await response.json();
      console.log("data", data);
      setListingData(data);
    } catch (error) {
      setShowListing(!showListing);
    }
  };

  const handleDeleteListing = async (_id) => {
    try {
      const response = await fetch(`/api/listing/delete/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (response.ok === false) return;
      const data = await response.json();
      console.log("data", data);
      setListingData(prev => prev.filter(item => item._id !== _id));
    } catch (error) {
      console.log(error.message);
      setUploadError(error.message);
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <img
          onClick={handleImageClick}
          src={
            progress === 100
              ? localStoreImage?.url || currentUser?.avatar
              : currentUser?.avatar || "/default-avatar.png"
          } // Fallback image
          alt="Profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        {file && (
          <p className="text-center text-slate-600 text-sm md:text-base">
            <span
              className={`
                  ${
                    progress === 100
                      ? "text-green-600 font-bold"
                      : "text-red-600"
                  }
                  transition-colors duration-300
                  `}
              aria-live="polite"
            >
              {status} ({progress} %)
              <br />
            </span>
            <span className="font-semibold text-xs md:text-sm truncate block max-w-full">
              {file.name} (
              {file.size
                ? file.size >= 1048576
                  ? `${(file.size / 1048576).toFixed(2)} MB`
                  : file.size >= 1024
                  ? `${(file.size / 1024).toFixed(2)} KB`
                  : `${file.size.toLocaleString()} bytes
                `
                : ""}
              )
            </span>
          </p>
        )}

        {uploadError && (
          <p className="text-red-700 text-center">{uploadError}</p>
        )}
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser?.username || ""}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          defaultValue={currentUser?.email || ""}
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer"
        >
          Update
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <button
          type="button"
          className="text-red-700 uppercase cursor-pointer"
          onClick={() => handleDelete(currentUser?._id)}
        >
          Delete Account
        </button>
        <button
          type="button"
          className="text-red-700 cursor-pointer uppercase"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>

      <button
        onClick={handelShowListing}
        className="w-full text-blue-500 cursor-pointer"
      >
        Show List
      </button>

      <p className="text-center text-red-700 mt-5">
        {showListing && "Facing issue while fetching listing"}
      </p>

      {listingData && listingData.length > 0 && (
        <div className="gap-3 flex flex-col">
          <h1 className="text-2xl font-semibold text-center">Data of Listings</h1>
          {listingData.map((listing) => (
            <div
              className="border bg-slate-100 grid grid-cols-3 items-center  p-3 rounded-lg"
              key={listing._id}
            >
              <Link to={`/listing/${listing._id}`}>
                {listing.imageUrls.length > 0 && (
                  <img
                    className="h-16 w-16 object-contain"
                    src={listing.imageUrls[0]}
                    alt="No Image 🚫"
                  />
                )}
              </Link>
              <Link
                className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                to={`/listing/${listing._id}`}
              >
                {listing.name}
              </Link>

             
              <div className="flex gap-2">
                <button onClick={() => handleDeleteListing(listing._id)} className="text-red-600 uppercase cursor-pointer">Delete</button>
                <button className="text-blue-600 uppercase cursor-pointer">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
