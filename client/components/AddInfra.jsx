// client/components/AddInfra.jsx
import React, { useState } from "react";
import axios from "../utils/axiosConfig.js";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Input } from "./ui/input.jsx";
import { Button } from "./ui/button.jsx";
import { Label } from "./ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx';

const AddInfra = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState({ lat: 13.0827, lng: 80.2707 }); // Chennai coords
  const [status, setStatus] = useState("Planned");
  const [loading, setLoading] = useState(false);

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
    formData.append("status", status);
    images.forEach((img) => formData.append("images", img));

    try {
      await axios.post("/govt/infra/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Infrastructure added successfully!");
      setTitle("");
      setDescription("");
      setImages([]);
      setStatus("Planned");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add infrastructure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Government Infrastructure</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="images">Images</Label>
            <Input id="images" type="file" multiple onChange={handleImageChange} />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Planned">Planned</SelectItem>
              <SelectItem value="Under Construction">Under Construction</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Infrastructure"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddInfra;