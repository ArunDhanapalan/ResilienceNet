// Dashboard.jsx
import { useState, useEffect } from "react";
import axios from "../utils/axiosConfig.js";
import Report from "./Report";
import { toast } from "react-hot-toast";

const Dashboard = ({ user }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // "list" or "report"

  // Fetch all issues from backend
  const getIssues = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/issues");
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

  // Update issue status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/issues/${id}`, { status });
      toast.success("Status updated");
      getIssues(); // refresh list
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    }
  };

  const renderList = () => {
    if (loading) return <div>Loading issues...</div>;
    if (!issues.length) return <div>No issues reported yet.</div>;

    return (
      <div className="space-y-4">
        {issues.map((issue) => (
          <div
            key={issue._id}
            className="border rounded-lg p-4 shadow-md bg-white"
          >
            <h3 className="text-xl font-bold">{issue.title}</h3>
            <p>{issue.description}</p>
            <p className="text-sm text-gray-500">
              Reporter: {issue.reporter?.email || "Unknown"}
            </p>
            <p className="text-sm text-gray-500">
              Status: {issue.status}
            </p>
            {issue.image && (
              <img
                src={issue.image}
                alt="issue"
                className="w-full max-w-xs mt-2 rounded"
              />
            )}
            {user && (
              <div className="mt-2 space-x-2">
                {["Reported", "In Progress", "Resolved"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(issue._id, s)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <button
          onClick={() => setView(view === "list" ? "report" : "list")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {view === "list" ? "Add Report" : "Back to Issues"}
        </button>
      </div>

      {view === "list" ? (
        renderList()
      ) : (
        <Report getIssues={getIssues} setView={setView} />
      )}
    </div>
  );
};

export default Dashboard;
