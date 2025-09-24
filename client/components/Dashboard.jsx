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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";

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
import { ScrollArea } from "@radix-ui/react-scroll-area";

const Dashboard = ({ user }) => {
  const [issues, setIssues] = useState([]);
  const [infraProjects, setInfraProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("home");
  const [showFullReport, setShowFullReport] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResolvedDialogOpen, setIsResolvedDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    inProgressIssues: 0,
    criticalIssues: 0,
    infraProjectsCount: 0,
  });

  // Fetch issues and infrastructure projects
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

  // Update stats whenever issues or infraProjects change
  useEffect(() => {
    const totalIssues = issues.length;
    const resolvedIssues = issues.filter((i) => i.status === "Resolved").length;
    const inProgressIssues = issues.filter(
      (i) => i.status === "In Progress"
    ).length;
    const criticalIssues = issues.filter(
      (i) => i.priority === "Critical"
    ).length;
    const infraProjectsCount = infraProjects.filter(
      (p) => p.status !== "Completed"
    ).length;

    setStats({
      totalIssues,
      resolvedIssues,
      inProgressIssues,
      criticalIssues,
      infraProjectsCount,
    });
  }, [issues, infraProjects]);

  // Render dashboard cards
  const renderDashboardCards = () => {
    if (user?.role === "govt") {
      return (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6">
          {/* Total Issues card */}
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
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

          {/* Resolved */}
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setIsResolvedDialogOpen(true)}
          >
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

          {/* In Progress */}
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

          {/* Critical */}
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

          {/* Projects */}
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

    // Non-govt users
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ">
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
              {issues.filter((i) => i.reporter?._id === user?._id).length}
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

  // Render the view based on the selected tab
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
        return user.role === "govt" ? (
          <GovernmentDashboard user={user} />
        ) : (
          <CommunityIssues issues={issues} loading={loading} user={user} />
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

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex-1 overflow-auto p-4 pb-20">{renderView()}</div>

      <Nav
        user={user}
        setView={setView}
        currentView={view}
        logout={() => {
          localStorage.clear();
          window.location.reload();
        }}
      />

      {/* Detailed report dialog */}
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

      {/* Total Issues dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Total Issues Details</DialogTitle>
            <DialogDescription>
              List of all Issues | Total Issues <b>{issues.length}</b>.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-2">
            <ScrollArea>
              {issues.map((issue) => (
                <div key={issue._id} className="p-2 border-b">
                  <p className="font-medium">{issue.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Status: {issue.status} | Priority: {issue.priority}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Location: {issue?.area || "N/A"}{" "}
                    {/* assuming issue.location.area */}
                  </p>
                  <div className="relative group inline-block">
                    <span className="text-sm text-muted-foreground cursor-pointer">
                      <p className="text-sm text-muted-foreground">
                        Reported Id{" "}
                        {issue.reporter && typeof issue.reporter === "object"
                          ? JSON.parse(JSON.stringify(issue.reporter))._id
                          : "Anonymous"}
                      </p>
                    </span>

                    <div className="absolute left-0 bottom-full mb-2 w-64 p-2 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <p>
                        <strong>Name:</strong>{" "}
                        {issue.reporter?.username || "Anonymous"}
                      </p>
                      <p>
                        <strong>Email:</strong> {issue.reporter?.email || "N/A"}
                      </p>
                      {/* <p>
                        <strong>Phone:</strong> {issue.reporter?.phone || "N/A"}
                      </p> */}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          <DialogFooter>
            <DialogClose className="btn btn-primary">Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isResolvedDialogOpen}
        onOpenChange={setIsResolvedDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resolved Issues Details</DialogTitle>
            <DialogDescription>
              List of all resolved issues | Total Issues solved{" "}
              <b>{issues.length}</b>.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="mt-4 max-h-[60vh]">
            {issues
              .filter((issue) => issue.status === "Resolved")
              .map((issue) => (
                <div key={issue._id} className="p-2 border-b">
                  <p className="font-medium">{issue.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Status: {issue.status} | Priority: {issue.priority}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Location: {issue.location?.area || "N/A"}
                  </p>
                  <div className="relative group inline-block">
                    <span className="text-sm text-muted-foreground cursor-pointer">
                      Reporter: {issue.reporter?.name || "Anonymous"} (ID:{" "}
                      {issue.reporter?._id || "N/A"})
                    </span>

                    <div className="absolute left-0 bottom-full mb-2 w-64 p-2 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <p>
                        <strong>Name:</strong>{" "}
                        {issue.reporter?.username || "Anonymous"}
                      </p>
                      <p>
                        <strong>Email:</strong> {issue.reporter?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;