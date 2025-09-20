import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig.js";
import { toast } from "react-hot-toast";
import IssuesMap from "./IssuesMap.jsx";
import CommunityIssues from "./CommunityIssues.jsx";
import MyIssues from "./MyIssues.jsx";
import Report from "./Report.jsx";
import GovernmentDashboard from "./GovernmentDashboard.jsx";
import DetailedReport from "./DetailedReport.jsx";
import AddInfra from "./AddInfra.jsx";
import InfrastructureUpdates from "./InfrastructureUpdates.jsx";
import Nav from "./Nav.jsx";
import { Dialog, DialogContent } from "./ui/dialog.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";

import {
  MapPin,
  Users,
  FileText,
  Plus,
  Building2,
  AlertCircle,
  TrendingUp,
  Clock,
} from "lucide-react";

const Dashboard = ({ user }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("home");
  const [showFullReport, setShowFullReport] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [infraProjects, setInfraProjects] = useState([]);
  const [stats, setStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    inProgressIssues: 0,
    criticalIssues: 0,
  });

  // ... (imports and state variables)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const issuesRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/issues`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIssues(issuesRes.data || []);

        const infraRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/infrastructure`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInfraProjects(infraRes.data || []);
      } catch (err) {
        toast.error("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshFlag]);

  useEffect(() => {
    const totalIssues = issues.length;
    const resolvedIssues = issues.filter(
      (issue) => issue.status === "Resolved"
    ).length;
    const inProgressIssues = issues.filter(
      (issue) => issue.status === "In Progress"
    ).length;
    const criticalIssues = issues.filter(
      (issue) => issue.priority === "Critical"
    ).length;
    const infraProjectsCount = infraProjects.filter(
      (project) => project.status !== "Completed"
    ).length;

    setStats({
      totalIssues,
      resolvedIssues,
      inProgressIssues,
      criticalIssues,
      infraProjectsCount,
    });
  }, [issues, infraProjects]);

  // ... (rest of the component)
  const renderDashboardCards = () => {
    if (user?.role === "govt") {
      return (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Issues
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalIssues}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.resolvedIssues}
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.inProgressIssues}
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.criticalIssues}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Building2 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.infraProjectsCount}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setView("map")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Map View</CardTitle>
            <MapPin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIssues}</div>
            <p className="text-xs text-muted-foreground">
              Total issues reported
            </p>
          </CardContent>
        </Card>
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setView("community")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIssues}</div>
            <p className="text-xs text-muted-foreground">Community issues</p>
          </CardContent>
        </Card>
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setView("my_issues")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Issues</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                issues.filter((issue) => issue.reporter?._id === user?._id)
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Your reported issues
            </p>
          </CardContent>
        </Card>
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setView("report")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Report Issue</CardTitle>
            <Plus className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+</div>
            <p className="text-xs text-muted-foreground">Report new issue</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderView = () => {
    switch (view) {
      case "map":
        return <IssuesMap issues={issues} onIssueClick={setShowFullReport} />;
      case "report":
        return (
          <Report
            getIssues={() => setRefreshFlag((prev) => !prev)}
            setView={setView}
          />
        );
      case "my_issues":
        return <MyIssues issues={issues} loading={loading} user={user} />;
      case "community":
        return (
          <>
            {user.role === "govt" ? (
              <GovernmentDashboard user={user} />
            ) : (
              <CommunityIssues issues={issues} loading={loading} user={user} />
            )}
          </>
        );

      case "infra":
        return <AddInfra user={user} />;
      case "infra_updates":
        return (
          <InfrastructureUpdates user={user} infraProjects={infraProjects} />
        );
      case "home":
        return (
          <>
            {renderDashboardCards()}
            <IssuesMap issues={issues} onIssueClick={setShowFullReport} />
          </>
        );
      default:
        return null;
    }
  };

  if (user?.role === "govt") {
    return (
      <div className="h-screen w-full flex flex-col">
        <div className="flex-1 overflow-auto p-4 pb-20">
          {view === "home2" && renderDashboardCards()}
          {view !== "home2" && renderView()}
        </div>
        <Nav
          user={user}
          setView={setView}
          currentView={view}
          logout={() => {
            localStorage.clear();
            window.location.reload();
          }}
          // extraTabs={[
          //   { key: "issues", label: "Issues", icon: FileText },
          //   { key: "infra_updates", label: "Infrastructure", icon: Building2 },
          // ]}
        />
        {showFullReport && (
          <Dialog
            open={!!showFullReport}
            onOpenChange={() => setShowFullReport(null)}
          >
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DetailedReport
                issueId={showFullReport}
                onClose={() => setShowFullReport(null)}
                user={user}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex-1 overflow-auto p-4 pb-20">
        {view === "map" && renderDashboardCards()}
        {renderView()}
      </div>
      <Nav
        user={user}
        setView={setView}
        currentView={view}
        logout={() => {
          localStorage.clear();
          window.location.reload();
        }}
      />
      {showFullReport && (
        <Dialog
          open={!!showFullReport}
          onOpenChange={() => setShowFullReport(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DetailedReport
              issueId={showFullReport}
              onClose={() => setShowFullReport(null)}
              user={user}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Dashboard;
