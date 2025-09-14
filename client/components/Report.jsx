import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../../server/utils/axiosConfig.js";

const Report = ({ getIssues, setView }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          toast.success("Location obtained");
        },
        () => {
          toast.error("Could not get location. Using default.");
          setLocation({ lat: 34.0522, lng: -118.2437 });
        }
      );
    } else {
      toast.error("Geolocation not supported. Using default.");
      setLocation({ lat: 34.0522, lng: -118.2437 });
    }
  };

  

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("lat", location.lat);
    formData.append("lng", location.lng);
    if (image) formData.append("image", image);

    try {
      await axios.post("/issues/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Issue reported successfully!");
      getIssues();
      setView("list");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to report issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 space-y-6 bg-white rounded-lg shadow-md border border-gray-200"
    >
      <h3 className="text-3xl font-bold text-center text-gray-800">
        Report a Civic Issue
      </h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Issue Title"
        required
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the issue..."
        required
        rows={4}
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      <input
        type="file"
        onChange={handleImageChange}
        className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        type="button"
        onClick={getLocation}
        className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-200"
      >
        Get Current Location
      </button>
      <div className="text-center text-sm text-gray-600">
        Location: Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
};

export default Report;
