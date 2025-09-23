import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig.js";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Badge } from "./ui/badge.jsx";
import { Button } from "./ui/button.jsx";
import { Skeleton } from "./ui/skeleton.jsx";
import {
  Building2,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  CircleDollarSign as Cash,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Save,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import { Textarea } from "./ui/textarea.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.jsx";

const InfrastructureUpdates = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/infrastructure");
      setProjects(res.data);
    } catch (err) {
      toast.error("Failed to fetch alerts/updates");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Under Construction":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "Maintenance Required":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "Out of Service":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Under Construction":
        return "bg-blue-100 text-blue-800";
      case "Maintenance Required":
        return "bg-orange-100 text-orange-800";
      case "Out of Service":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const openProjectDialog = (project) => {
    setSelectedProject(project);
    setEditedProject({ ...project });
    setCurrentImageIndex(0);
    setIsEditing(false);
  };

  const handleUpdateProject = async () => {
    try {
      await axios.put(`/infrastructure/${editedProject._id}`, editedProject);
      toast.success("Project updated successfully!");
      setSelectedProject(null);
      fetchProjects();
    } catch (err) {
      toast.error("Failed to update project.");
      console.error(err);
    } finally {
      setIsEditing(false);
    }
  };

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditedProject((prev) => ({ ...prev, [id]: value }));
  };

  const handleStatusChange = (status) => {
    setEditedProject((prev) => ({ ...prev, status }));
  };

  const nextImage = () => {
    if (selectedProject?.images) {
      setCurrentImageIndex(
        (prev) => (prev + 1) % selectedProject.images.length
      );
    }
  };

  const prevImage = () => {
    if (selectedProject?.images) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + selectedProject.images.length) %
          selectedProject.images.length
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Alerts</h2>
        <Button onClick={fetchProjects} variant="outline">
          Refresh
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No alerts/updates found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card
              key={project._id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openProjectDialog(project)}
            >
              {project.images && project.images.length > 0 && (
                <img
                  src={project.images[0]}
                  alt={project.name}
                  className="h-40 w-full object-cover rounded-t-lg"
                />
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge className={getStatusColor(project.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(project.status)}
                      <span>{project.status}</span>
                    </div>
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{project.type}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {project.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{project.area}</span>
                  </div>

                  {project.budget && (
                    <div className="flex items-center space-x-2">
                      <Cash className="h-4 w-4 text-gray-500" />
                      <span>{formatCurrency(project.budget)}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <Button variant="link" className="p-0 h-auto">
                  See More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog for details and editing */}
      {selectedProject && (
        <Dialog
          open={!!selectedProject}
          onOpenChange={() => setSelectedProject(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing
                  ? `Edit: ${selectedProject.name}`
                  : selectedProject.name}
              </DialogTitle>
            </DialogHeader>

            {selectedProject.images && selectedProject.images.length > 0 && (
              <div className="relative w-full h-64 overflow-hidden rounded-lg mb-4">
                <img
                  src={selectedProject.images[currentImageIndex]}
                  alt={`${selectedProject.name} ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                {selectedProject.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="space-y-3 text-sm text-gray-700">
              {isEditing ? (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editedProject.name || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editedProject.description || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      value={editedProject.area || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={editedProject.budget || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="progress">Progress (%)</Label>
                    <Input
                      id="progress"
                      type="number"
                      value={editedProject.progress || 0}
                      onChange={handleEditChange}
                      max={100}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={editedProject.status || ""}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planned">Planned</SelectItem>
                        <SelectItem value="Under Construction">
                          Being Implemented
                        </SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        {/* <SelectItem value="Maintenance Required">Maintenance Required</SelectItem> */}
                        <SelectItem value="Out of Service">Dropped</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={editedProject.notes || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <p>{selectedProject.description}</p>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{selectedProject.area}</span>
                  </div>
                  {selectedProject.budget && (
                    <div className="flex items-center space-x-2">
                      <Cash className="h-4 w-4 text-gray-500" />
                      <span>{formatCurrency(selectedProject.budget)}</span>
                    </div>
                  )}
                  {selectedProject.estimatedCompletion && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>
                        Due: {formatDate(selectedProject.estimatedCompletion)}
                      </span>
                    </div>
                  )}
                  {selectedProject.contractor && (
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span>{selectedProject.contractor}</span>
                    </div>
                  )}
                  <div className="space-y-1 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{selectedProject.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${selectedProject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  {selectedProject.notes && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-3">
                      <strong>Notes:</strong> {selectedProject.notes}
                    </div>
                  )}
                </>
              )}
            </div>
            {user?.role === "govt" && (
              <div className="flex justify-end gap-2 mt-4">
                {isEditing ? (
                  <>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                    >
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                    <Button onClick={handleUpdateProject}>
                      <Save className="h-4 w-4 mr-2" /> Save
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default InfrastructureUpdates;
