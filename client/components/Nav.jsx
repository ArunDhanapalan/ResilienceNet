// client/components/Nav.jsx
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { 
  MapPin, 
  Users, 
  FileText, 
  Plus, 
  Building2, 
  LogOut,
  Home,
  Settings,
  TrendingUp
} from 'lucide-react';

const Nav = ({ user, setView, currentView, logout }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <>
        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
          <div className="flex items-center justify-around py-2">
            {user?.role === 'citizen' ? (
              <>
                <Button
                  variant={currentView === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('map')}
                  className="flex flex-col items-center space-y-1 h-16 w-16"
                >
                  <MapPin className="h-5 w-5" />
                  <span className="text-xs">Map</span>
                </Button>
                <Button
                  variant={currentView === 'community' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('community')}
                  className="flex flex-col items-center space-y-1 h-16 w-16"
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Community</span>
                </Button>
                <Button
                  variant={currentView === 'my_issues' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('my_issues')}
                  className="flex flex-col items-center space-y-1 h-16 w-16"
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">My Issues</span>
                </Button>
                <Button
                  variant={currentView === 'report' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('report')}
                  className="flex flex-col items-center space-y-1 h-16 w-16"
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-xs">Report</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={currentView === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('map')}
                  className="flex flex-col items-center space-y-1 h-16 w-16"
                >
                  <MapPin className="h-5 w-5" />
                  <span className="text-xs">Map</span>
                </Button>
                <Button
                  variant={currentView === 'community' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('community')}
                  className="flex flex-col items-center space-y-1 h-16 w-16"
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Issues</span>
                </Button>
                <Button
                  variant={currentView === 'infra' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('infra')}
                  className="flex flex-col items-center space-y-1 h-16 w-16"
                >
                  <Building2 className="h-5 w-5" />
                  <span className="text-xs">Add Infra</span>
                </Button>
                <Button
                  variant={currentView === 'infra_updates' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('infra_updates')}
                  className="flex flex-col items-center space-y-1 h-16 w-16"
                >
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-xs">Updates</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex flex-col items-center space-y-1 h-16 w-16"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-xs">Logout</span>
                </Button>
              </>
            )}
          </div>
        </nav>
      </>
    );
  }

  // Desktop Navigation
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-orange-600">ResilienceNet</h1>
          <div className="flex items-center space-x-4">
            <Button
              variant={currentView === 'map' ? 'default' : 'ghost'}
              onClick={() => setView('map')}
              className="flex items-center space-x-2"
            >
              <MapPin className="h-4 w-4" />
              <span>Map</span>
            </Button>
            <Button
              variant={currentView === 'community' ? 'default' : 'ghost'}
              onClick={() => setView('community')}
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>{user?.role === 'citizen' ? 'Community' : 'Issues'}</span>
            </Button>
            {user?.role === 'citizen' && (
              <>
                <Button
                  variant={currentView === 'my_issues' ? 'default' : 'ghost'}
                  onClick={() => setView('my_issues')}
                  className="flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>My Issues</span>
                </Button>
                <Button
                  variant={currentView === 'report' ? 'default' : 'ghost'}
                  onClick={() => setView('report')}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Report</span>
                </Button>
              </>
            )}
            {user?.role === 'govt' && (
              <>
                <Button
                  variant={currentView === 'infra' ? 'default' : 'ghost'}
                  onClick={() => setView('infra')}
                  className="flex items-center space-x-2"
                >
                  <Building2 className="h-4 w-4" />
                  <span>Add Infrastructure</span>
                </Button>
                <Button
                  variant={currentView === 'infra_updates' ? 'default' : 'ghost'}
                  onClick={() => setView('infra_updates')}
                  className="flex items-center space-x-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Infrastructure Updates</span>
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Welcome, {user?.username || user?.email}
          </span>
          <Button variant="outline" onClick={logout} className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;