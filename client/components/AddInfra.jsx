import React, { useState } from 'react';
import axios from '../utils/axiosConfig.js';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Label } from './ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx';
import { Textarea } from './ui/textarea.jsx';
import { MapPin, X } from 'lucide-react';

const AddInfra = ({ user }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    lat: '',
    lng: '',
    area: '',
    budget: '',
    estimatedCompletion: '',
    contractor: '',
    progress: 0,
    notes: '',
    status: 'Planned', // Default status
  });
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      
      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreview(previews);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreview(newPreviews);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setFormData(prev => ({
            ...prev,
            lat: latitude.toString(),
            lng: longitude.toString()
          }));
          toast.success('Location obtained!');
        },
        (err) => {
          console.error('Geolocation error:', err);
          toast.error('Location access denied or timed out.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.error('Geolocation not supported.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      // Append images
      images.forEach((img) => submitData.append('images', img));

      await axios.post('/infrastructure/create', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success('Critical Update created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        type: '',
        description: '',
        lat: '',
        lng: '',
        area: '',
        budget: '',
        estimatedCompletion: '',
        contractor: '',
        progress: 0,
        notes: '',
        status: 'Planned',
      });
      setImages([]);
      setImagePreview([]);
    } catch (err) {
      toast.error('Failed to create critical update!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

//   if (user?.role !== 'govt') {
//     return (
//       <div className="max-w-4xl mx-auto p-4">
//         <Card>
//           <CardContent className="text-center py-8">
//             <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
//             <h2 className="text-xl font-semibold text-gray-700 mb-2">Access Denied</h2>
//             <p className="text-gray-500">Only government officials can add infrastructure updates.</p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-6 w-6" />
            <span>Add Critical Update/Alert</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Update Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter update name"
                />
              </div>
              <div>
                <Label htmlFor="type">Update Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select update type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Road">Road/Bridge</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Building">Building</SelectItem>
                    {/* <SelectItem value="Park">Park</SelectItem> */}
                    <SelectItem value="Water System">Water System</SelectItem>
                    <SelectItem value="Sewage System">Sewage System</SelectItem>
                    <SelectItem value="Electricity Grid">Electricity Grid</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe the critical update"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="lat">Latitude *</Label>
                <Input
                  id="lat"
                  name="lat"
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={handleChange}
                  required
                  placeholder="12.9716"
                />
              </div>
              <div>
                <Label htmlFor="lng">Longitude *</Label>
                <Input
                  id="lng"
                  name="lng"
                  type="number"
                  step="any"
                  value={formData.lng}
                  onChange={handleChange}
                  required
                  placeholder="77.5946"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  className="w-full"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Location
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="area">Area *</Label>
              <Input
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                placeholder="Enter area/location name"
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select update status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="Under Construction">Being Implemented</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  {/* <SelectItem value="Maintenance Required">Maintenance Required</SelectItem> */}
                  <SelectItem value="Out of Service">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Budget (₹)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Enter budget amount"
                />
              </div>
              <div>
                <Label htmlFor="estimatedCompletion">Estimated Completion</Label>
                <Input
                  id="estimatedCompletion"
                  name="estimatedCompletion"
                  type="date"
                  value={formData.estimatedCompletion}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contractor">Organisation</Label>
                <Input
                  id="contractor"
                  name="contractor"
                  value={formData.contractor}
                  onChange={handleChange}
                  placeholder="Enter organisation name"
                />
              </div>
              <div>
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  name="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Additional notes about the alert"
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor="images">Update Images</Label>
              <div className="mt-2">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              
              {/* Image Preview */}
              {imagePreview.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Image Previews:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating Update...' : 'Create Critical Update'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddInfra;
