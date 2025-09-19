// client/components/GovernmentDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig.js";
import { toast } from "react-hot-toast";
import {
  Card,
  CardTitle,
  CardDescription,
} from "./ui/card.jsx";
import { Badge } from "./ui/badge.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.jsx";
import { Skeleton } from "./ui/skeleton.jsx";
import IssuesMap from "./IssuesMap.jsx";

const GovernmentDashboard = ({ user }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const token = localStorage.getItem("token");

  // ✅ make fetchIssues reusable
  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/issues`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // ✅ filter out resolved
      const filtered = res.data.filter((issue) => issue.status !== "Resolved");
      setIssues(filtered);
    } catch (err) {
      toast.error("Failed to fetch issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [token]);

  const handleUpdateStatus = async (issueId, newStatus) => {
    try {
      await axios.put(
        `/issues/${issueId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Issue status updated successfully!");
      fetchIssues(); // ✅ call our reusable fetchIssues
    } catch (err) {
      toast.error("Failed to update status.");
      console.error(err);
    }
  };

  const openDialog = (issue) => {
    setSelectedIssue(issue);
    setDialogOpen(true);
    setCurrentImageIndex(0);
  };

  const nextImage = (images) => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = (images) => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const imagesToDisplay = selectedIssue?.images || [];

  // restrict access
  if (user?.role !== "govt") {
    return (
      <div className="p-4 space-y-4">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-500">
            Only government officials can access this dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Government Dashboard</h1>
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-[100px] w-full rounded-lg" />
          <Skeleton className="h-[100px] w-full rounded-lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {issues.map((issue) => (
            <Card
              key={issue._id}
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => openDialog(issue)}
            >
              <div className="flex flex-col space-y-2">
                <CardTitle>{issue.title}</CardTitle>
                <CardDescription>Category: {issue.category}</CardDescription>
                <CardDescription>
                  Reporter: {issue.reporter?.username}
                </CardDescription>
                <Badge variant="default">{issue.status}</Badge>

                <Select
                  onValueChange={(newStatus) =>
                    handleUpdateStatus(issue._id, newStatus)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>{selectedIssue?.title}</DialogTitle>
            <DialogDescription>{selectedIssue?.description}</DialogDescription>
            <p className="text-sm font-medium text-gray-700">
              Category:{" "}
              <span className="font-normal ml-1">
                {selectedIssue?.category}
              </span>
            </p>
          </DialogHeader>

          <div className="p-6">
            <div className="flex flex-col space-y-4">
              {imagesToDisplay.length > 0 ? (
                <div className="relative overflow-hidden w-full aspect-video rounded-md bg-gray-200">
                  <img
                    src={imagesToDisplay[currentImageIndex]}
                    alt={`Issue image ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                  {imagesToDisplay.length > 1 && (
                    <>
                      <button
                        onClick={() => prevImage(imagesToDisplay)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                      >
                        &#8249;
                      </button>
                      <button
                        onClick={() => nextImage(imagesToDisplay)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                      >
                        &#8250;
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No images available for this issue.
                </div>
              )}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">
                  Coordinates:
                  <span className="font-normal ml-1">
                    Lat: {selectedIssue?.location?.lat.toFixed(4)}, Lng:{" "}
                    {selectedIssue?.location?.lng.toFixed(4)}
                  </span>
                </p>
                <p className="text-sm font-medium text-gray-700">
                  Area:{" "}
                  <span className="font-normal ml-1">
                    {selectedIssue?.area}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <IssuesMap issues={issues} onIssueClick={openDialog} />
    </div>
  );
};

export default GovernmentDashboard;
