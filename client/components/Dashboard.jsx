// client/components/Dashboard.jsx
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
  Clock
} from 'lucide-react';

const Dashboard = ({ user }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("map");
  const [showFullReport, setShowFullReport] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [stats, setStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    inProgressIssues: 0,
    criticalIssues: 0
  });

  const getIssues = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/issues");
      setIssues(res.data);
      calculateStats(res.data);
    } catch (err) {
      toast.error("Failed to fetch issues.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (issuesData) => {
    const total = issuesData.length;
    const resolved = issuesData.filter(issue => issue.status === 'Resolved').length;
    const inProgress = issuesData.filter(issue => issue.status === 'In Progress').length;
    const critical = issuesData.filter(issue => issue.priority === 'Critical').length;
    
    setStats({
      totalIssues: total,
      resolvedIssues: resolved,
      inProgressIssues: inProgress,
      criticalIssues: critical
    });
  };

  const getGovtIssues = async () => {
    setLoading(true);
    try {
        const res = await axios.get("/issues/all");
        setIssues(res.data);
        calculateStats(res.data);
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
        return <IssuesMap issues={issues} onIssueClick={setShowFullReport} />;
      case "report":
        return <Report getIssues={() => setRefreshFlag(prev => !prev)} setView={setView} />;
      case "my_issues":
        return <MyIssues issues={issues} loading={loading} user={user} />;
      case "community":
        return <CommunityIssues issues={issues} loading={loading} user={user} />;
      case "infra":
        return <AddInfra user={user} />;
      case "infra_updates":
        return <InfrastructureUpdates user={user} />;
      default:
        return <IssuesMap issues={issues} onIssueClick={setShowFullReport} />;
    }
  };

  const renderDashboardCards = () => {
    if (user?.role === 'govt') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
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
              <div className="text-2xl font-bold text-green-600">{stats.resolvedIssues}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgressIssues}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.criticalIssues}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setView('infra_updates')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Infrastructure</CardTitle>
              <Building2 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">+</div>
              <p className="text-xs text-muted-foreground">View projects</p>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setView('map')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Map View</CardTitle>
              <MapPin className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalIssues}</div>
              <p className="text-xs text-muted-foreground">Total issues reported</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setView('community')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Community</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalIssues}</div>
              <p className="text-xs text-muted-foreground">Community issues</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setView('my_issues')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Issues</CardTitle>
              <FileText className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issues.filter(issue => issue.reporter?._id === user?._id).length}</div>
              <p className="text-xs text-muted-foreground">Your reported issues</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setView('report')}>
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
    }
  };

  // If the user is government, render the government dashboard
  if (user?.role === 'govt') {
    return (
        <div className="h-screen w-full flex flex-col">
            <div className="flex-1 overflow-auto p-4 pb-20">
                {view === 'infra' ? (
                  <AddInfra />
                ) : (
                  <>
                    {renderDashboardCards()}
                    <GovernmentDashboard user={user} />
                  </>
                )}
            </div>
            <Nav user={user} setView={setView} currentView={view} logout={() => { localStorage.clear(); window.location.reload(); }} />
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
        {view === 'map' && renderDashboardCards()}
        {renderView()}
      </div>
      <Nav user={user} setView={setView} currentView={view} logout={() => { localStorage.clear(); window.location.reload(); }} />
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