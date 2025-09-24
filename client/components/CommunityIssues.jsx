"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { Skeleton } from "../components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

import { Button } from "../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

// ShadCN ComboBox for area filter
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

// New ShadCN ComboBox for category filter
const CategoryFilter = ({ categoriesWithCount, selectedCategory, onChange, totalCount }) => {
    const [open, setOpen] = useState(false);
  
    const options = [
      { label: `All Categories (${totalCount})`, value: "" },
      ...categoriesWithCount.map(({ category, count }) => ({
        label: `${category} (${count})`,
        value: category,
      })),
    ];
  
    const selectedLabel =
      options.find((opt) => opt.value === selectedCategory)?.label || "Select category";
  
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
      {/* </PopoverContent> */}
    </Popover>
    );
};

const CommunityIssues = ({ issues, loading, user, onIssueClick }) => {
  const [communityIssues, setCommunityIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // New state for category filter

  useEffect(() => {
    if (issues) {
      const filteredIssues = user
        ? issues.filter((issue) => issue.reporter?._id !== user._id)
        : issues;
      setCommunityIssues(filteredIssues);
    } else {
      setCommunityIssues([]);
    }
  }, [issues, user]);

  const areasWithCount = useMemo(() => {
    const counts = {};
    communityIssues.forEach((i) => {
      if (i.area) {
        counts[i.area] = (counts[i.area] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([area, count]) => ({ area, count }));
  }, [communityIssues]);
  
  // New useMemo hook to get categories with their counts
  const categoriesWithCount = useMemo(() => {
    const counts = {};
    communityIssues.forEach((i) => {
      if (i.category) {
        counts[i.category] = (counts[i.category] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([category, count]) => ({ category, count }));
  }, [communityIssues]);

  const totalCount = communityIssues.length;

  const filteredIssues = useMemo(() => {
    let result = communityIssues;
    if (selectedArea) {
      result = result.filter((issue) => issue.area === selectedArea);
    }
    // Add category filter
    if (selectedCategory) {
      result = result.filter((issue) => issue.category === selectedCategory);
    }
    return result;
  }, [communityIssues, selectedArea, selectedCategory]);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Reported":
        return "default";
      case "In Progress":
        return "outline";
      case "Resolved":
        return "secondary";
      default:
        return "default";
    }
  };

  const openDialog = (issue) => {
    if (onIssueClick) {
      onIssueClick(issue._id);
    } else {
      setSelectedIssue(issue);
      setDialogOpen(true);
      setCurrentImageIndex(0);
    }
  };

  const nextImage = (images) => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = (images) => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const renderCommunityIssues = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-[100px] w-full rounded-lg" />
          <Skeleton className="h-[100px] w-full rounded-lg" />
          <Skeleton className="h-[100px] w-full rounded-lg" />
        </div>
      );
    }

    if (filteredIssues.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          No community issues to display.
        </div>
      );
    }

    return (
      <ScrollArea className="h-[70vh]">
        <div className="space-y-3 pr-4">
          {filteredIssues.map((issue) => (
            <Card
              key={issue._id}
              onClick={() => openDialog(issue)}
              className="cursor-pointer hover:bg-gray-100 transition-colors p-4"
            >
              <div className="flex flex-row items-center justify-between space-x-4">
                <div className="flex-1">
                  <CardTitle>{issue.title}</CardTitle>
                  <CardDescription>
                    Reporter: {issue.reporter?.username || "Anonymous"}
                  </CardDescription>
                  <div className="mt-2">
                    <Badge variant={getStatusBadgeVariant(issue.status)}>
                      {issue.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Area: {issue.area || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Category: {issue.category || "Unknown"}
                  </p>
                </div>
                {issue.images && issue.images.length > 0 && (
                  <div className="h-20 w-20 flex-shrink-0">
                    <img
                      src={issue.images[0]}
                      alt="Issue"
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    );
  };

  const imagesToDisplay = selectedIssue?.images || [];

  return (
    <>
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Community Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0">
            {areasWithCount.length > 0 && (
              <AreaFilter
                areasWithCount={areasWithCount}
                selectedArea={selectedArea}
                onChange={setSelectedArea}
                totalCount={totalCount}
              />
            )}
            {categoriesWithCount.length > 0 && (
              <CategoryFilter
                categoriesWithCount={categoriesWithCount}
                selectedCategory={selectedCategory}
                onChange={setSelectedCategory}
                totalCount={totalCount}
              />
            )}
          </div>
          {renderCommunityIssues()}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>{selectedIssue?.title}</DialogTitle>
            <DialogDescription>{selectedIssue?.description}</DialogDescription>
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
                  <span className="font-normal ml-1">{selectedIssue?.area}</span>
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommunityIssues;