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

const IssuesMap = ({ issues }) => {
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
                <h3 className="font-bold">{issue.title}</h3>
                <p>{issue.description}</p>
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{issue.status}</span>
                {issue.image && (
                  <img src={issue.image} alt="Issue" className="mt-2 rounded" style={{ maxWidth: "100px" }} />
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
};

export default IssuesMap;