import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig.js';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { Button } from './ui/button.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog.jsx';
import { 
  MapPin, 
  Calendar, 
  User, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';

const DetailedReport = ({ issueId, onClose, user }) => {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageDialog, setShowImageDialog] = useState(false);

  useEffect(() => {
    if (issueId) {
      fetchIssueDetails();
    }
  }, [issueId]);

  const fetchIssueDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/issues/${issueId}`);
      setIssue(res.data);
    } catch (err) {
      toast.error('Failed to fetch issue details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Reported':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const nextImage = () => {
    if (issue?.images?.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % issue.images.length);
    }
  };

  const prevImage = () => {
    if (issue?.images?.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + issue.images.length) % issue.images.length);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Issue not found</p>
        <Button onClick={onClose} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onClose} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <div className="flex items-center space-x-2">
          {getStatusIcon(issue.status)}
          <Badge variant="outline" className={getPriorityColor(issue.priority)}>
            {issue.priority}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{issue.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{issue.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Reporter:</span>
                  <span>{issue.reporter?.username || 'Unknown'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Reported:</span>
                  <span>{formatDate(issue.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Area:</span>
                  <span>{issue.area || 'Unknown'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Category:</span>
                  <span>{issue.category}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">Coordinates:</span>
                </div>
                <p className="text-sm text-gray-600">
                  Lat: {issue.location.lat.toFixed(6)}, Lng: {issue.location.lng.toFixed(6)}
                </p>
              </div>

              {issue.assignedDepartment && (
                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium">Assigned Department:</span>
                  </div>
                  <Badge variant="secondary">{issue.assignedDepartment}</Badge>
                </div>
              )}

              {issue.estimatedResolutionTime && (
                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Estimated Resolution:</span>
                  </div>
                  <p className="text-sm text-gray-600">{issue.estimatedResolutionTime}</p>
                </div>
              )}

              {issue.resolutionNotes && (
                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium">Resolution Notes:</span>
                  </div>
                  <p className="text-sm text-gray-600">{issue.resolutionNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Images */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>Images ({issue.images?.length || 0})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {issue.images && issue.images.length > 0 ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={issue.images[currentImageIndex]}
                      alt={`Issue image ${currentImageIndex + 1}`}
                      className="w-full h-64 object-cover rounded-lg cursor-pointer"
                      onClick={() => setShowImageDialog(true)}
                    />
                    {issue.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                        >
                          &#8249;
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                        >
                          &#8250;
                        </button>
                      </>
                    )}
                  </div>
                  
                  {issue.images.length > 1 && (
                    <div className="flex space-x-2 justify-center">
                      {issue.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex ? 'bg-orange-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setShowImageDialog(true)}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full Size
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No images available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Issue Images</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="relative">
              <img
                src={issue.images[currentImageIndex]}
                alt={`Issue image ${currentImageIndex + 1}`}
                className="w-full h-auto max-h-96 object-contain rounded-lg"
              />
              {issue.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                  >
                    &#8249;
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                  >
                    &#8250;
                  </button>
                </>
              )}
            </div>
            {issue.images.length > 1 && (
              <div className="flex space-x-2 justify-center mt-4">
                {issue.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImageIndex ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailedReport;
