import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../utils/axiosConfig.js";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.jsx";

const chennaiCoords = { lat: 13.0827, lng: 80.2707 };

const isWithinChennai = (lat, lng) => {
  const minLat = 12.9;
  const maxLat = 13.25;
  const minLng = 80.0;
  const maxLng = 80.45;
  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
};

const Report = ({ getIssues, setView }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(chennaiCoords);
  const [area, setArea] = useState("");
  const [category, setCategory] = useState("Other"); // New state for category
  const [loading, setLoading] = useState(false);
  const [areaLoading, setAreaLoading] = useState(false);

  const getAreaFromCoords = async (lat, lng) => {
    setAreaLoading(true);
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      if (res.data?.address?.city) {
        setArea(res.data.address.city);
        toast.success(`Area: ${res.data.address.city}`);
      } else if (res.data?.address?.suburb) {
        setArea(res.data.address.suburb);
        toast.success(`Area: ${res.data.address.suburb}`);
      } else {
        setArea("Unknown Area");
      }
    } catch (err) {
      setArea("Unknown Area");
    } finally {
      setAreaLoading(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (isWithinChennai(latitude, longitude)) {
            setLocation({ lat: latitude, lng: longitude });
            toast.success("Location obtained!");
          } else {
            setLocation(chennaiCoords);
            toast.error("Location is outside Chennai. Using default.");
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          toast.error("Location access denied or timed out. Using default.");
          setLocation(chennaiCoords);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.error("Geolocation not supported. Using default.");
      setLocation(chennaiCoords);
    }
  };

  useEffect(() => {
    getAreaFromCoords(location.lat, location.lng);
  }, [location]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("lat", location.lat);
    formData.append("lng", location.lng);
    formData.append("area", area);
    formData.append("category", category); // Append the new category

    images.forEach((img) => formData.append("images", img));

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
      {/* Category selection dropdown */}
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Roads">Roads</SelectItem>
          <SelectItem value="Water">Water</SelectItem>
          <SelectItem value="Electricity">Electricity</SelectItem>
          <SelectItem value="Sanitation">Sanitation</SelectItem>
          <SelectItem value="Public Property">Public Property</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
      <input
        type="file"
        multiple
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
        <p className="mt-1 text-xs text-gray-400">
          Area: {areaLoading ? "Looking up area..." : area}
        </p>
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