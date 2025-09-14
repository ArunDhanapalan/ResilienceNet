import React from 'react';
import axios from "../utils/axiosConfig.js";
import { toast } from 'react-hot-toast';

const Dashboard = ({ issues = [], getIssues, setView }) => {
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/issues/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Issue marked as ${status}`);
      getIssues();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Reported Issues</h2>
        <button
          onClick={() => setView('report')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Report Issue
        </button>
      </div>

      {issues.length === 0 ? (
        <p>No issues reported yet.</p>
      ) : (
        <ul className="space-y-4">
          {issues.map((issue) => (
            <li key={issue._id} className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">{issue.title}</h3>
              <p>{issue.description}</p>
              {issue.image && (
                <img
                  src={issue.image}
                  alt={issue.title}
                  className="w-full h-60 object-cover mt-2 rounded-md"
                />
              )}
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => updateStatus(issue._id, 'In Progress')}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  In Progress
                </button>
                <button
                  onClick={() => updateStatus(issue._id, 'Resolved')}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Resolved
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">Status: {issue.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
