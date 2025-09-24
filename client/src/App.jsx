import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Dashboard from "../components/Dashboard";
import Login from "../components/Login";
import LoadingPage from "../components/LoadingPage";
import Report from "../components/Report";
import Nav from "../components/Nav";
import MyIssues from "../components/MyIssues";
import GovernmentDashboard from "../components/GovernmentDashboard";
import Header from "../components/Header";

axios.defaults.withCredentials = true;

const App = () => {
  const [user, setUser] = useState(null);
  const [issues, setIssues] = useState([]);
  const [view, setView] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const getIssues = async (token) => {
    try {
      const res = await axios.get(`{import.meta.env.VITE_BACKEND_URL}/issues`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssues(res.data);
    } catch (err) {
      toast.error("Failed to fetch issues");
    }
  };

  const checkUser = async (token) => {
    if (!token) return setLoading(false);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/current`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        await getIssues(token);
      } else {
        setUser(null);
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  console.log(user);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIssues([]);
    toast.success("Logged out");
    setView("login");
  };

  // ✅ Fetch user on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    checkUser(token);
  }, []);

  // ✅ Refetch issues automatically whenever user logs in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (user && token) {
      getIssues(token);
    }
  }, [user]);

  if (loading) return <LoadingPage />;

  <>
    <MyIssues issues={issues} loading={loading} user={user} />
    <GovernmentDashboard issues={issues} loading={loading} user={user} />
  </>;

  const renderView = () => {
    if (!user)
      return <Login setUser={setUser} setRefreshFlag={setRefreshFlag} />;
    switch (view) {
      case "dashboard":
        return (
          <Dashboard
            key={refreshFlag} // optional: forces remount if needed
            issues={issues}
            getIssues={() => getIssues(localStorage.getItem("token"))}
            setView={setView}
            user={user}
          />
        );
      case "report":
        return (
          <Report
            getIssues={() => getIssues(localStorage.getItem("token"))}
            setView={setView}
            user={user}
          />
        );
      default:
        return (
          <Dashboard
            issues={issues}
            getIssues={() => getIssues(localStorage.getItem("token"))}
            setView={setView}
            user={user}
          />
        );
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      <main className="flex-1 w-full bg-gray-100">
        <Header user={user} />
        {renderView()}
      </main>
    </div>
  );
};

export default App;
