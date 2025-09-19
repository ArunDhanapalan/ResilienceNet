import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const IssuesMap = ({ issues, onIssueClick }) => {
  const chennaiCoords = [13.0827, 80.2707];
  const [mapCenter, setMapCenter] = useState(chennaiCoords);

  useEffect(() => {
    if (issues && issues.length > 0) {
      const firstIssue = issues[0].location;
      setMapCenter([firstIssue.lat, firstIssue.lng]);
    }
  }, [issues]);

  return (
    <Card className="h-full z-10">
      <CardHeader>
        <CardTitle>Live Map of Issues</CardTitle>
      </CardHeader>
      <CardContent>
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          scrollWheelZoom={true} 
          className="h-[500px] md:h-[calc(70vh-8rem)] w-full rounded-md z-0"
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {issues.map((issue) => (
            <Marker 
              key={issue._id} 
              position={[issue.location.lat, issue.location.lng]}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-bold text-sm mb-2">{issue.title}</h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{issue.description}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{issue.status}</span>
                    {issue.priority && (
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        issue.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                        issue.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                        issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {issue.priority}
                      </span>
                    )}
                  </div>
                  {issue.images && issue.images.length > 0 && (
                    <img src={issue.images[0]} alt="Issue" className="mt-2 rounded w-full h-20 object-cover" />
                  )}
                  {onIssueClick && (
                    <button
                      onClick={() => onIssueClick(issue._id)}
                      className="mt-2 w-full px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
};

export default IssuesMap;