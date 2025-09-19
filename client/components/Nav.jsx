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
  return (
    <>
      {/* Universal Bottom Navigation - works for both mobile and desktop */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {user?.role !== 'govt' ? (
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
};

export default Nav;