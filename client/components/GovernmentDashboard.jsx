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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover.jsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command.jsx";
import { Check, ChevronsUpDown } from "lucide-react";

// Filter component for areas
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


const GovernmentDashboard = ({ user }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedArea, setSelectedArea] = useState("");

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
    if (token) {
        fetchIssues();
    }
  }, [token]);

  const areasWithCount = useMemo(() => {
    const counts = {};
    issues.forEach((i) => {
      if (i.area) {
        counts[i.area] = (counts[i.area] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([area, count]) => ({ area, count }));
  }, [issues]);

  const totalCount = issues.length;

  const filteredIssues = useMemo(() => {
    if (!selectedArea) return issues;
    return issues.filter((issue) => issue.area === selectedArea);
  }, [issues, selectedArea]);

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

      {!loading && issues.length > 0 && (
         <AreaFilter
            areasWithCount={areasWithCount}
            selectedArea={selectedArea}
            onChange={setSelectedArea}
            totalCount={totalCount}
          />
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-[150px] w-full rounded-lg" />
          <Skeleton className="h-[150px] w-full rounded-lg" />
          <Skeleton className="h-[150px] w-full rounded-lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIssues.map((issue) => (
            <Card
              key={issue._id}
              className="p-4 cursor-pointer hover:bg-gray-50 flex flex-col justify-between"
              onClick={() => openDialog(issue)}
            >
              <div className="space-y-2">
                <CardTitle>{issue.title}</CardTitle>
                <CardDescription>Area: {issue.area}</CardDescription>
                <CardDescription>
                  Reporter: {issue.reporter?.username}
                </CardDescription>
                <Badge variant="default">{issue.status}</Badge>
              </div>

              <div onClick={(e) => e.stopPropagation()} className="mt-4">
                <Select
                  onValueChange={(newStatus) =>
                    handleUpdateStatus(issue._id, newStatus)
                  }
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={`overflow-y-scroll h-[90vh] p-0`}>
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
                    Lat: {selectedIssue?.location?.lat?.toFixed(4) ?? "N/A"}, Lng:{" "}
                    {selectedIssue?.location?.lng?.toFixed(4) ?? "N/A"}
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
    </div>
  );
};

export default GovernmentDashboard;