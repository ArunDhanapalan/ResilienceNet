// client/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig.js";
import { toast } from "react-hot-toast";
import IssuesMap from "./IssuesMap.jsx";
import CommunityIssues from "./CommunityIssues.jsx";
import MyIssues from "./MyIssues.jsx";
import Report from "./Report.jsx";
import GovernmentDashboard from "./GovernmentDashboard.jsx";
import Nav from "./Nav.jsx";
// import Footer from "./Footer.jsx";
import { Dialog, DialogContent } from "./ui/dialog.jsx";

const Dashboard = ({ user }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("map");
  const [showFullReport, setShowFullReport] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const getIssues = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/issues");
      setIssues(res.data);
    } catch (err) {
      toast.error("Failed to fetch issues.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getGovtIssues = async () => {
    setLoading(true);
    try {
        const res = await axios.get("/issues/all");
        setIssues(res.data);
    } catch (err) {
        toast.error("Failed to fetch government issues.");
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'govt') {
      getGovtIssues();
    } else {
      getIssues();
    }
  }, [user, refreshFlag]);

  const renderView = () => {
    switch (view) {
      case "map":
        return <IssuesMap issues={issues} />;
      case "report":
        return <Report getIssues={() => setRefreshFlag(prev => !prev)} setView={setView} />;
      case "my_issues":
        return <MyIssues issues={issues} loading={loading} user={user} />;
      case "community":
        return <CommunityIssues issues={issues} loading={loading} user={user} />;
      default:
        return <IssuesMap issues={issues} />;
    }
  };

  // If the user is government, render the government dashboard
  if (user?.role === 'govt') {
    return (
        <div className="h-screen w-full flex flex-col">
          <Nav user={user} setView={setView} currentView={view} />
            <div className="flex-1 overflow-auto p-4">
                <GovernmentDashboard user={user} />
            </div>
        </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col">
    <Nav user={user} setView={setView} currentView={view} />
      <div className="flex-1 overflow-auto p-4">
        {renderView()}
      </div>
      {showFullReport && (
        <Dialog
          open={!!showFullReport}
          onOpenChange={() => setShowFullReport(null)}
        >
          <DialogContent>{/* Full report content goes here */}</DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Dashboard;