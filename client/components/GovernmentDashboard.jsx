"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "../utils/axiosConfig.js";
import { toast } from "react-hot-toast";
import { Card, CardTitle, CardDescription } from "./ui/card.jsx";
import { Badge } from "./ui/badge.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.jsx";
import { Skeleton } from "./ui/skeleton.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.jsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command.jsx";
import { Check, ChevronsUpDown, FileDown, Loader2 } from "lucide-react";

// ---------------- Filter Components ----------------
const AreaFilter = ({ areasWithCount, selectedArea, onChange, totalCount }) => {
  const [open, setOpen] = useState(false);

  const options = [
    { label: `All Areas (${totalCount})`, value: "" },
    ...areasWithCount.map(({ area, count }) => ({
      label: `${area} (${count})`,
      value: area,
    })),
  ];

  const selectedLabel =
    options.find((opt) => opt.value === selectedArea)?.label || "Select area";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full md:w-64 justify-between mb-4"
        >
          {selectedLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full md:w-64 p-0">
        <Command>
          <CommandInput placeholder="Search area..." />
          <CommandList>
            <CommandEmpty>No area found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={
                      selectedArea === opt.value
                        ? "mr-2 h-4 w-4 opacity-100"
                        : "mr-2 h-4 w-4 opacity-0"
                    }
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const CategoryFilter = ({
  categoriesWithCount,
  selectedCategory,
  onChange,
  totalCount,
}) => {
  const [open, setOpen] = useState(false);

  const options = [
    { label: `All Categories (${totalCount})`, value: "" },
    ...categoriesWithCount.map(({ category, count }) => ({
      label: `${category} (${count})`,
      value: category,
    })),
  ];

  const selectedLabel =
    options.find((opt) => opt.value === selectedCategory)?.label ||
    "Select category";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full md:w-64 justify-between mb-4 md:ml-4"
        >
          {selectedLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full md:w-64 p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={
                      selectedCategory === opt.value
                        ? "mr-2 h-4 w-4 opacity-100"
                        : "mr-2 h-4 w-4 opacity-0"
                    }
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// ---------------- Main Component ----------------
const GovernmentDashboard = ({ user }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Resolve workflow state
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [resolvingIssue, setResolvingIssue] = useState(null);
  const [afterImageFile, setAfterImageFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const token = localStorage.getItem("token");

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/issues`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const filtered = res.data.filter((issue) => issue.status !== "Resolved");
      setIssues(filtered);
    } catch (err) {
      toast.error("Failed to fetch issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchIssues();
  }, [token]);

  const areasWithCount = useMemo(() => {
    const counts = {};
    issues.forEach((i) => {
      if (i.area) counts[i.area] = (counts[i.area] || 0) + 1;
    });
    return Object.entries(counts).map(([area, count]) => ({ area, count }));
  }, [issues]);

  const categoriesWithCount = useMemo(() => {
    const counts = {};
    issues.forEach((i) => {
      if (i.category) counts[i.category] = (counts[i.category] || 0) + 1;
    });
    return Object.entries(counts).map(([category, count]) => ({
      category,
      count,
    }));
  }, [issues]);

  const totalCount = issues.length;

  const filteredIssues = useMemo(() => {
    let result = issues;
    if (selectedArea)
      result = result.filter((issue) => issue.area === selectedArea);
    if (selectedCategory)
      result = result.filter((issue) => issue.category === selectedCategory);
    return result;
  }, [issues, selectedArea, selectedCategory]);

  const handleStatusChange = (issue, newStatus) => {
    if (newStatus === "Resolved") {
      setResolvingIssue(issue);
      setIsResolveDialogOpen(true);
    } else {
      handleUpdateStatus(issue._id, newStatus);
    }
  };

  const handleUpdateStatus = async (issueId, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/issues/${issueId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Issue status updated successfully!");
      fetchIssues();
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      console.log("Uploading file:", file);
      
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/infrastructure/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data.url;
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Image upload failed!");
      throw err;
    }
  };

  const handleVerifyAndResolve = async () => {
  if (!afterImageFile || !resolvingIssue) {
    toast.error("Please select an 'after' image.");
    return;
  }

  if (!resolvingIssue.images?.length) {
    toast.error("This issue has no 'before' image.");
    return;
  }

  setIsVerifying(true);

  try {
    // 1️⃣ Upload the after image to Cloudinary
    const afterImageUrl = await uploadImage(afterImageFile);

    // 2️⃣ Use the first image as the 'before' image
    const beforeImageUrl = resolvingIssue.images[0];

    // 3️⃣ Call backend route that does verification + email
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/issues/verify-issue`,
      {
        before: beforeImageUrl,
        after: afterImageUrl,
        issueId: resolvingIssue._id,
      }
    );

    // 4️⃣ Handle the response
    if (data.verification?.resolved) {
      toast.success("Issue verified and email sent successfully!");

      // Update frontend state
      await handleUpdateStatus(resolvingIssue._id, "Resolved");
      setIsResolveDialogOpen(false);
      setAfterImageFile(null);
      setResolvingIssue(null);
    } else {
      toast.error(
        `Verification Failed${data.verification?.reason ? ": " + data.verification.reason : ""}`,
        { duration: 7000 }
      );
    }
  } catch (err) {
    console.error("Verification/email error:", err);
    toast.error("Verification/email error occurred.");
  } finally {
    setIsVerifying(false);
  }
};


  const openDialog = (issue) => {
    setSelectedIssue(issue);
    setDialogOpen(true);
    setCurrentImageIndex(0);
  };

  const nextImage = (images) =>
    setCurrentImageIndex((i) => (i + 1) % images.length);
  const prevImage = (images) =>
    setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);

  const imagesToDisplay = selectedIssue?.images || [];

  const downloadCSV = () => {
    const headers = ["Title", "Area", "Category", "Reporter", "Status"];
    const rows = filteredIssues.map((i) => [
      i.title,
      i.area,
      i.category,
      i.reporter?.username || "Unreported",
      i.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "issues.csv";
    link.click();
  };

  if (user?.role !== "govt") {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-gray-700">Access Denied</h2>
        <p className="text-gray-500">
          Only government officials can access this dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Government Dashboard</h1>
        {issues.length > 0 && (
          <Button variant="outline" onClick={downloadCSV}>
            <FileDown /> Download CSV
          </Button>
        )}
      </div>

      {!loading && issues.length > 0 && (
        <div className="flex flex-col md:flex-row">
          <AreaFilter
            areasWithCount={areasWithCount}
            selectedArea={selectedArea}
            onChange={setSelectedArea}
            totalCount={totalCount}
          />
          <CategoryFilter
            categoriesWithCount={categoriesWithCount}
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
            totalCount={totalCount}
          />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[150px] w-full rounded-lg" />
          ))}
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="text-center py-10 text-gray-500 font-medium">
          No government issues in the dashboard.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredIssues.map((issue) => (
            <Card
              key={issue._id}
              className="p-4 cursor-pointer hover:bg-gray-50 flex flex-col justify-between"
              onClick={() => openDialog(issue)}
            >
              <div className="space-y-2">
                <CardTitle>{issue.title}</CardTitle>
                <CardDescription>Area: {issue.area}</CardDescription>
                <CardDescription>Category: {issue.category}</CardDescription>
                <CardDescription>
                  Reporter: {issue.reporter?.username || "Unreported"}
                </CardDescription>
                <Badge variant="default">{issue.status}</Badge>
              </div>

              <div onClick={(e) => e.stopPropagation()} className="mt-2">
                <Select
                  onValueChange={(newStatus) =>
                    handleStatusChange(issue, newStatus)
                  }
                  value={issue.status}
                >
                  <SelectTrigger>
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

      {/* Issue details dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="overflow-y-scroll h-[90vh] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>{selectedIssue?.title}</DialogTitle>
            <DialogDescription>{selectedIssue?.description}</DialogDescription>
            <p className="text-sm font-medium text-gray-700">
              Category:{" "}
              <span className="font-normal">{selectedIssue?.category}</span>
            </p>
          </DialogHeader>
          <div className="p-6">
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
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white"
                    >
                      &#8249;
                    </button>
                    <button
                      onClick={() => nextImage(imagesToDisplay)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white"
                    >
                      &#8250;
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No images available
              </div>
            )}
            <div className="mt-4 space-y-1">
              <p className="text-sm font-medium text-gray-700">
                Coordinates:{" "}
                <span className="font-normal">
                  Lat: {selectedIssue?.location?.lat?.toFixed(4) ?? "N/A"}, Lng:{" "}
                  {selectedIssue?.location?.lng?.toFixed(4) ?? "N/A"}
                </span>
              </p>
              <p className="text-sm font-medium text-gray-700">
                Area: <span className="font-normal">{selectedIssue?.area}</span>
              </p>
              <p className="text-sm font-medium text-gray-700">
                Reporter:{" "}
                <span className="font-normal">
                  {selectedIssue?.reporter?.username || "Unreported"}
                </span>
              </p>
              <p className="text-sm font-medium text-gray-700">
                Created at:{" "}
                <span className="font-normal">{selectedIssue?.createdAt}</span>
              </p>
              <p className="text-sm font-medium text-gray-700">
                Updated at:{" "}
                <span className="font-normal">{selectedIssue?.updatedAt}</span>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Issue: {resolvingIssue?.title}</DialogTitle>
            <DialogDescription>
              Upload an “after” image to mark this issue as resolved.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setAfterImageFile(e.target.files[0])}
              disabled={isVerifying}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResolveDialogOpen(false)}
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerifyAndResolve}
              disabled={!afterImageFile || isVerifying}
            >
              {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isVerifying ? "Verifying..." : "Verify & Resolve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GovernmentDashboard;