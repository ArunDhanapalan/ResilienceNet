import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import Report from '../components/Report';
import Nav from '../components/Nav';

axios.defaults.withCredentials = true;

const App = () => {
  const [user, setUser] = useState(null);
  const [issues, setIssues] = useState([]);
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  const getIssues = async () => {
    try {
      const res = await axios.get('http://localhost:5000/issues');
      setIssues(res.data);
    } catch (err) {
      toast.error('Failed to fetch issues');
    }
  };

  const checkUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/auth/current', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.user) setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
    setView('login');
  };

  useEffect(() => {
    checkUser();
    getIssues();
  }, []);

  if (loading) return <div className="text-center text-lg font-semibold">Loading...</div>;

  const renderView = () => {
    if (!user) return <Login setUser={setUser} />;
    switch (view) {
      case 'dashboard':
        return <Dashboard issues={issues} getIssues={getIssues} setView={setView} />;
      case 'report':
        return <Report getIssues={getIssues} setView={setView} />;
      default:
        return <Dashboard issues={issues} getIssues={getIssues} setView={setView} />;
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4">
      {user && <Nav user={user} logout={logout} setView={setView} />}
      <main className="w-full max-w-4xl mt-8 p-4 bg-white rounded-xl shadow-lg border border-gray-200">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
