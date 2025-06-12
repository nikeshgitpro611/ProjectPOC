import { useEffect, useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [formDate, setFormDate] = useState({
    imageUrls: [],
    type: "rent",
    name: "",
    description: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 8000,
    discountPrice: 1000,
    userRef: currentUser?._id || null,
  });
  const [error, setError] = useState(null);

  // console.log("currentUser", currentUser);

  const handelImageSubmit = async (e) => {
    e.preventDefault();
    if (file.length > 0 && file.length < 7) {
      try {
        const uploadedFiles = await Promise.all(
          file.map((f) => storageImages(f))
        );
        setFile(uploadedFiles); // Now this contains actual uploaded image URLs
        setFormDate((prevState) => ({
          ...prevState,
          imageUrls: uploadedFiles,
        }));
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  };

  const storageImages = async (file) => {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "your_unsigned_preset");
      data.append("cloud_name", "dtfbfplqq");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dtfbfplqq/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const result = await response.json();

      return result.secure_url; // Return the result directly instead of console.logging
    } catch (error) {
      throw error; // Rethrow the error to be handled by the caller
    }
  };

  const handelChange = (e) => {
    const { id, value, checked, type } = e.target;
    console.log("checked", checked);

    if (type === "checkbox") {
      if (id === "sale" || id === "rent") {
        setFormDate((prevState) => ({
          ...prevState,
          type: id,
        }));
      } else if (id === "parking" || id === "furnished" || id === "offer") {
        setFormDate((prevState) => ({
          ...prevState,
          [id]: checked,
        }));
      }
    } else {
      setFormDate((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const handelChangeImageList = (valIndex) => {
    console.log("valIndex", valIndex);

    setFormDate((prevState) => ({
      ...prevState,
      imageUrls: formDate.imageUrls.filter((_, index) => index !== valIndex),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("formDate", formDate);

    try {
      if (formDate.imageUrls.length < 1) {
        setLoading(true);
        setError("Please upload at least one image.");
        setTimeout(() => {
          setLoading(false);
          setError(false);
        }, 3000);
        return;
      }

      const response = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDate),
      });
      if (response.ok === false) {
        throw new Error("Failed to create listing.");
      }

      const data = await response.json();
      console.log("successTest", data.success);

      if (data.success === false) {
        setLoading(true);
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }
      setSuccess("Listing created successfully.");
      setTimeout(() => {
        setSuccess(null);
        navigate("/");
      }, 3000);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    console.log("loading", loading);
  }, [loading, error]);

  console.log("loading : ", loading);

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form
        className="flex flex-col sm:flex-row gap-6 justify-between"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="name"
            id="name"
            name="name"
            required
            className="border p-3 rounded-lg"
            onChange={handelChange}
            value={formDate.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            name="Description"
            id="description"
            required
            className="border p-3 rounded-lg"
            onChange={handelChange}
            value={formDate.description}
          />
          <input
            type="text"
            placeholder="Address"
            name="address"
            id="address"
            required
            className="border p-3 rounded-lg"
            onChange={handelChange}
            value={formDate.address}
          />

          <div className="flex gap-6 flex-wrap capitalize">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handelChange}
                checked={formDate.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handelChange}
                checked={formDate.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handelChange}
                checked={formDate.parking}
              />
              <span>parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handelChange}
                checked={formDate.furnished}
              />
              <span>furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handelChange}
                checked={formDate.offer}
              />
              <span>offers</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                className="border p-3 rounded-lg border-gray-300"
                required
                onChange={handelChange}
                value={formDate.bedrooms}
              />
              <p>Beds 🛏️</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                className="border p-3 rounded-lg border-gray-300"
                required
                onChange={handelChange}
                value={formDate.bathrooms}
              />
              <p>Bath 🛁</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                name="regularPrice"
                min="8000"
                max="20000"
                className="border p-3 rounded-lg border-gray-300"
                required
                onChange={handelChange}
                value={formDate.regularPrice}
              />
              <p>
                Regular Prices <span className="text-xs"> /Months</span> 💵
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                name="discountPrice"
                min="1000"
                max="10000"
                className="border p-3 rounded-lg border-gray-300"
                onChange={handelChange}
                value={formDate.discountPrice}
                required
              />
              <p>
                Discount Price <span className="text-xs"> /Months</span> 🫠
              </p>
            </div>
          </div>
        </div>

        {/* // IMAGE UPLOAD */}
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images :
            <span className="text-xs">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300"
              onChange={(e) => setFile([...e.target.files])}
            />
            <button
              disabled={loading}
              onClick={handelImageSubmit}
              className="cursor-pointer hover:bg-gray-200 border rounded-lg p-3 bg-green-600 shadow-sm"
            >
              {formDate.imageUrls.length > 0 ? "Upload" : "Upload Image"}
            </button>
          </div>
          {loading && <p className="text-red-600">{error}</p>}
          {formDate.imageUrls.length > 0 &&
            formDate.imageUrls.map((url, index) => (
              <div
                key={index}
                className="flex justify-between p-3 border items-center border-r-4"
              >
                <img
                  src={url}
                  alt="Image Preview"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75 cursor-pointer"
                  onClick={() => handelChangeImageList(index)}
                >
                  Remove
                </button>
              </div>
            ))}

          <div className=" gap-4">
            {formDate.imageUrls.length > 0 && (
              <button className="w-full cursor-pointer hover:bg-gray-200 border rounded-lg p-3 bg-green-200 shadow-sm">
                Create List
              </button>
            )}

            {success && (
              <p className="text-green-600 text-center mt-2 text-2xl">
                {success}📃
              </p>
            )}
          </div>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
