import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// New Components for the 4-Quadrant Layout
import MyIssues from "./MyIssues";
import CommunityIssues from "./CommunityIssues";
import IssuesMap from "./IssuesMap";
import InfrastructureUpdates from "./InfrastructureUpdates";
import Report from "./Report";

// Shadcn UI Imports
import { Button } from "../components/ui/button";

const Dashboard = ({ user }) => {
  const [view, setView] = useState("dashboard"); // "dashboard" or "report"
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const getIssues = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/issues`);
      setIssues(res.data);
    } catch (err) {
      console.error("Error fetching issues:", err);
      toast.error("Failed to fetch issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getIssues();
  }, []);

  // ------------------------
  // Citizen Dashboard
  // ------------------------
  const renderCitizenDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-1">
        <MyIssues
          issues={issues.filter((issue) => issue.reporter?._id === user?._id)}
          loading={loading}
          user={user}
        />
      </div>
      <div className="md:col-span-1">
        <CommunityIssues
          issues={issues.filter((issue) => issue.reporter?._id !== user?._id)}
          loading={loading}
          user={user}
        />
      </div>
      <div className="md:col-span-2">
        <IssuesMap issues={issues} />
      </div>
      <div className="md:col-span-2">
        <InfrastructureUpdates />
      </div>
    </div>
  );

  // ------------------------
  // Staff Dashboard
  // ------------------------
  const renderStaffDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-1">
        <MyIssues
          issues={issues.filter((issue) => issue.reporter?._id === user?._id)}
          loading={loading}
          user={user}
        />
      </div>
      <div className="md:col-span-1">
        <CommunityIssues
          issues={issues.filter((issue) => issue.reporter?._id !== user?._id)}
          loading={loading}
          user={user}
        />
      </div>
      <div className="md:col-span-2">
        <IssuesMap issues={issues} />
      </div>
      <div className="md:col-span-2">
        {/* Placeholder for Add Infrastructure Form */}
        <div className="p-6 border rounded-lg shadow-md bg-white">
          <h3 className="text-xl font-bold">
            Add Infrastructure Update (Staff)
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            This section will be a form for staff to add new infrastructure
            updates. I will generate this component in a future step.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Dashboard
        </h2>
        <Button
          onClick={() => setView(view === "dashboard" ? "report" : "dashboard")}
          className="min-w-[150px]"
        >
          {view === "dashboard" ? "Add Report" : "Back to Dashboard"}
        </Button>
      </div>

      {view === "dashboard" ? (
        user?.role === "staff" ? renderStaffDashboard() : renderCitizenDashboard()
      ) : (
        <Report getIssues={getIssues} setView={setView} />
      )}
    </div>
  );
};

export default Dashboard;
