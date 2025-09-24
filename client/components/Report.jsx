import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../utils/axiosConfig.js";
import { getCategorySuggestions } from "../utils/imageCategorization.js";

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
  const [category, setCategory] = useState("Other");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [areaLoading, setAreaLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [categorizing, setCategorizing] = useState(false);
  const [categorySuggestions, setCategorySuggestions] = useState([]);

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

  useEffect(() => {
    if (description.trim()) {
      const suggestions = getCategorySuggestions(description);
      setCategorySuggestions(suggestions);
    } else {
      setCategorySuggestions([]);
    }
  }, [description]);

  const categorizeImageWithAPI = async (imageFile) => {
    setCategorizing(true);
    try {
      const response = await axios.post(
        "https://adhithya200503.app.n8n.cloud/webhook/266a7033-cb27-4cd2-8ea5-1984f0a89236",
        imageFile,
        {
          headers: {
            "Content-Type": imageFile.type,
          },
        }
      );

      const result = response.data?.content?.parts?.[0]?.text;
      if (result && result.type && result.score) {
        const { type, score } = result;
        if (score > 0.5) {
          setCategory(type);
          toast.success(`AI suggested category: ${type} (${Math.round(score * 100)}% confidence)`);
        }
      } else {
        toast.error("AI categorization response was in an unexpected format.");
      }
    } catch (error) {
      console.error("Error categorizing image with API:", error);
      toast.error("AI categorization failed.");
    } finally {
      setCategorizing(false);
    }
  };

  const handleImageChange = async (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreview(previews);
      
      if (files.length > 0) {
        await categorizeImageWithAPI(files[0]);
      }
    }
  };
  
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreview(newPreviews);
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
    formData.append("category", category);
    formData.append("priority", priority);

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
    <div className="mx-auto h-fit w-fit p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl w-full p-8 space-y-6 bg-white rounded-lg shadow-md border border-gray-200"
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
        
        <div className="space-y-2">
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
          
          {categorySuggestions.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Suggested categories based on your description:</p>
              <div className="flex flex-wrap gap-2">
                {categorySuggestions.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCategory(suggestion.category)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {suggestion.category} ({Math.round(suggestion.confidence * 100)}%)
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {categorizing && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>AI is analyzing your images...</span>
            </div>
          )}
        </div>
        
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select priority level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        
        {imagePreview.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Image Previews:</h4>
            <div className="grid grid-cols-2 gap-2">
              {imagePreview.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
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
    </div>
  );
};

export default Report;