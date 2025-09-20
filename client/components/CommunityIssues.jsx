// client/components/CommunityIssues.jsx
import { useEffect, useState } from "react";
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

const CommunityIssues = ({ issues, loading, user, onIssueClick }) => {
  const [communityIssues, setCommunityIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (issues && user) {
      const filteredIssues = issues.filter(
        (issue) => issue.reporter?._id !== user._id
      );
      setCommunityIssues(filteredIssues);
    } else {
      setCommunityIssues(issues || []);
    }
  }, [issues, user]);

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

    if (communityIssues.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          No community issues to display.
        </div>
      );
    }

    return (
      <ScrollArea className="h-screen">
        <div className="space-y-3 pr-4">
          {communityIssues.map((issue) => (
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
        <CardContent>{renderCommunityIssues()}</CardContent>
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
                    Lat: {selectedIssue?.location?.lat.toFixed(4)}, Lng:{" "}
                    {selectedIssue?.location?.lng.toFixed(4)}
                  </span>
                </p>
                <p className="text-sm font-medium text-gray-700">
                  Area: <span className="font-normal ml-1">{selectedIssue?.area}</span>
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